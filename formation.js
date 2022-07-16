function convertToTitleCase(str) {
    const s = str.replace(/([A-Z])/g, ' $1').toLowerCase();

    return s[0].toUpperCase() + s.slice(1);
}

function parse(str, validationRules = ['required', 'min', 'max']) {

    function parseLayout(block) {
        const lines = block.split(/\n/);

        return lines.map(line => line.split(',').map((item) => item.trim()) )
    }

    function parseConfig(block) {
        function keyValueInterpreter(property, index) {
            let key, value;
            if (property.indexOf('=') !== -1) {
                [key, value] = property.split('=');
                value = value.replace(/"/g, '');
                if (key === 'form' && forms[value]) {
                    value = parse(forms[value].join("\n\n"));
                }
            } else if (index === 0) {
                key = 'component';
                value = property;
            } else {
                key = property;
                value = true;
            }

            return [key, value];
        }
        const output = {};

        if (block) {
            const lines = block.split(/\n/);

            lines.forEach(line => {
                const def = line.match(/^([a-z\d]+)\s+-\s+([^\n]+)/i);

                const parts = {};
                def[2].match(/([a-z\d=]+".*?"|[^",\s]+)(?=\s*,|\s*$)/ig)
                    .map((item, index) => {
                        console.log(item);

                        const [key, value] = keyValueInterpreter(item.trim(), index);
                        parts[key] = value;
                    });
                if (!parts.label) {
                    parts.label = convertToTitleCase(def[1]);
                }
                parts.validation = {};
                validationRules.forEach(validationRuleName => {
                    if (parts[validationRuleName]){
                        parts.validation[validationRuleName] = parts[validationRuleName];
                        delete parts[validationRuleName];
                    }
                });
                output[def[1]] = parts;
            });
        }
        return output;
    }

    function parseValidation(block) {
        return block ? block.split(/\s+/) : [];
    }

    function detectMainFormAndSubForms(blocks) {
        let name = 'main';
        const forms = {[name]: []};
        blocks.map(block => {
            const headingMatch = block.trim().match(/^#([^\n]+)\n/);

            if (headingMatch) {
                name = headingMatch[1].trim();
                forms[name] = [];
                block = block.substring(block.indexOf("\n")).trim();
            }
            forms[name].push(block);
        });

        return forms;
    }
    if (!str)  {
        return {};
    }
    const blocks = str.trim().split(/[\n\s]{2,}/g);
    const forms = detectMainFormAndSubForms(blocks);

    const layout = parseLayout(forms.main[0]);
    const config = parseConfig(forms.main[1]);
    const validation = parseValidation(forms.main[2]);

    layout.flat().forEach(field => {
        if (!config[field]) {
            config[field] = {
                component: 'text',
                label: convertToTitleCase(field),
                validation: {},
            };
        }
    });

    return {
        layout, config, validation,
    };

}
function createState(form) {
    const keys = form.layout.flat();
    const state = {};
    keys.forEach((item) => {
        if (['list', 'checkbox-group'].includes(form.config[item].component)) {
            state[item] = [];
        } else if (form.config[item].component === 'select' && form.config[item].multiple) {
            state[item] = [];
        } else if (form.config[item].component === 'checkbox') {
            state[item] = false;
        } else {
            state[item] = '';
        }
    });

    return state;

}
export default {parse, createState};