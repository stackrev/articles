<template>
  <v-app id="app">
    <v-main>
      <v-card class="mx-auto my-12" max-width="450">
        <v-card-title>Welcome to this Google API Article</v-card-title>
        <v-card-text>
          <v-row align="center" class="mx-0">
            <div class="grey--text">
              Enter your name, press enter and receive the welcome from Google
              Cloud's Serverless backend.
            </div>
          </v-row>
          <v-row align="center" class="mx-0">
            <v-col cols="12">
              <v-form ref="form">
                <v-text-field
                  v-model="form.name"
                  :rules="rules.name"
                  label="First name"
                  required
                ></v-text-field>
                <v-btn @click="submit"> submit </v-btn>
              </v-form>
            </v-col>
          </v-row>
          <v-row align="center" class="mx-0">
            <v-snackbar v-model="snackbar" absolute top right :color="color">
              <span>Returned {{message}}</span>
              <v-icon dark> mdi-checkbox-marked-circle </v-icon>
            </v-snackbar>
          </v-row>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

const DEFAULT_TIMEOUT = 1000 * 60;

export default {
  name: 'App',
  data() {
    const defaultForm = Object.freeze({
      name: '',
    });

    return {
      form: Object.assign({}, defaultForm),
      rules: {
        name: [(val) => (val || '').length > 0 || 'Field Required!'],
      },
      message: '',
      snackbar: false,
      color: 'error'
    };
  },
  methods: {
    resetForm() {
      this.form = Object.assign({}, this.defaultForm);
      this.$refs.form.reset();
    },
    submit() {
      this.snackbar = false;
      if (this.$refs.form.validate()){
        axios
          .post('https://hellogw-10huahm.nw.gateway.dev/hello', JSON.stringify(this.form), {
            timeout: DEFAULT_TIMEOUT,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          })
          .then((response) => {
            this.message = response.data;
            this.color = 'success'
          })
          .catch((error) => {
            this.message = error.message;
          })
          .finally(() => {
            this.snackbar = true;
            this.resetForm();
          });
      }
    },
  },
};
</script>
