<script setup>
import {reactive, ref} from 'vue'
import { Formation } from '../index.js';
import { dictionaries } from './dictionaries';

const props = defineProps(['state', 'layout', 'config'])
const validationFunctions =  {
  required: (value, param) => (!value ? 'Required' : null),
  min: (value, length) => {
    const message = 'Minimum ' + length;
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length < length ? message : null;
    } else {
      return value < length ? message : null;
    }
  }
};
let errors = reactive({});


function validate(key) {
  errors[key] = '';
  const validation = props.config[key].validation;
  Object.keys(validation).find((validationFnName) => {
    const ruleResponse = validationFunctions[validationFnName](props.state[key], validation[validationFnName]);
    if (ruleResponse) {
      errors[key] = ruleResponse;
      return true;
    }
  });
}

function createItem(fieldName) {
  props.state[fieldName].push(Formation.createState(props.config[fieldName].form));
}

</script>

<template>
  <div class="row" v-for="row in layout">
    <div class="field" :style="{ flex: config[fieldName].width ? config[fieldName].width : 1 }" v-for="fieldName in row" >
      <div v-if="config[fieldName].component === 'list'">
        <div class="list-label">{{ config[fieldName].label }}</div>
        <button class="btn btn-success btn-sm pull-right" @click="createItem(fieldName)">+</button>
        <div class="list-container">
          <div v-if="props.state[fieldName].length">
            <div v-for="(item, index) in props.state[fieldName]"  class="list-item">
              <div>
                <FormBuilder :layout="config[fieldName].form.layout"
                             :config="config[fieldName].form.config"
                             :state="item">
                </FormBuilder>
              </div>
              <div>
                <button class="btn btn-sm btn-danger" @click="props.state[fieldName].splice(index, 1)">X</button>
              </div>
            </div>
          </div>
          <div class="empty" v-else>
            Empty list
          </div>
        </div>
      </div>
      <div v-else>
        <label>{{ config[fieldName].label }}</label>

        <input type="text"
               v-if="config[fieldName].component === 'text'"
               v-model="props.state[fieldName]"
               class="form-control"
               @input="validate(fieldName)">

        <input type="password"
               v-if="config[fieldName].component === 'password'"
               v-model="props.state[fieldName]"
               class="form-control"
               @input="validate(fieldName)">

        <div class="checkbox" v-if="config[fieldName].component === 'checkbox'">
          <label>
            <input type="checkbox"
                   v-model="props.state[fieldName]"
                   :value="config[fieldName].id">{{ config[fieldName].value }}
          </label>
        </div>


        <div v-if="config[fieldName].component === 'checkbox-group'">
          <div class="checkbox" v-for="option in dictionaries[config[fieldName].options]">
            <label>
              <input type="checkbox"
                     v-model="props.state[fieldName]"
                     :value="option.id">{{ option.value }}
            </label>
          </div>
        </div>
        <div v-if="config[fieldName].component === 'radio'">
          <div class="radio" v-for="option in dictionaries[config[fieldName].options]">
            <label>
              <input type="radio"
                     v-model="props.state[fieldName]"
                     :value="option.id">{{ option.value }}
            </label>
          </div>
        </div>

        <select v-if="config[fieldName].component === 'select'"
                :multiple="config[fieldName].multiple"
                v-model="props.state[fieldName]"
                class="form-control">
          <option v-for="option in dictionaries[config[fieldName].options]" :value="option.id">{{ option.value }}</option>
        </select>


      </div>

      <div class="message">{{ errors[fieldName] }}</div>
    </div><!-- /.col-lg-6 -->
  </div><!-- /.row -->
</template>

<style scoped>
.list-label {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}
.list-item {
  display: grid;
  grid-template-columns: 1fr 20px;
  align-items: center;
  column-gap: 20px;
}
.list-container {
  padding: 20px;
}
.empty {
  text-align: center;
  font-size: 18px;
  font-style: italic;
  margin: 10px 0;
}
.row {
  column-gap: 15px;
  display: flex;
}
.form {
  width: 100%;
  text-align: left;
}
.message {
  height: 20px;
  color: darkred;
  margin-left: 5px;
  margin-bottom: 8px;
}
</style>