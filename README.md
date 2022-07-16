# Formation.JS

Easiest solution to create and manage forms for CRMs.

#### Description
This solution consists of two entities.
 - **Parser** that generates json-schema out of `formation` syntax
 - Default `FormBuilder` component - an example of self-contained smart component that renders a form by json-schema. 

 > Feel free to implement your own form-builder !

## Usage:
#### javascript:
```javascript
import { Formation } from 'Formation'

const definition = 'firstName, lastName'; // simple form on `FormationJS` syntax
const form = Formation.parse(definition);
const state = Formation.createState(form);
```
#### template:
```html
<FormBuilder :state="state"
             :layout="form.layout"
             :config="form.config">
</FormBuilder>
```

## Syntax explanation
Script consists of 3 blocks separated by double `\n`
 - Layout
 - Field definitions
 - Cross-field validation rules

> Blocks can be omitted

> Cross-field validation rule statements result in plain arrays of elements.  
> A good practice to keep rule name in between of field names: `field RULE field2`

### Layout
This block defines how fields will be rendered. Separate field names by comma.

### Field definitions
This block describes what each field should represent.  
It's `field_name - [component_type], attr_1=val_1, attr_2=val_2 ` 

> Field validations are attributed as any other attribute.
> If you want to add your custom field validation rules, specify second param for `parse` method, so parser will separate them under `validation` property for a field config
>```javascript
> Formation.parse(source, ['required', 'min', 'max'])
>```

> If there is no definition, default is used which is `text`

**Example:**
```text
pass
pass2

pass - password, label="Password"
pass2 - password, label="Repeat password"

pass SHOULD_BE_EQUAL_TO pass2
```

Sub-forms can be defined after and  through `#` + `name`  

**Example:**

```text
partners

partners - list, form=partner

#partner
firstName, lastName
```



