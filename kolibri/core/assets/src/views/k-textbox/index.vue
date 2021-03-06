<template>

  <ui-textbox
    ref="textbox"
    v-model="currentText"
    :label="label"
    :disabled="disabled"
    :required="required"
    :invalid="invalid"
    :error="invalidText"
    :autofocus="autofocus"
    :maxlength="maxlength"
    :autocomplete="autocomplete"
    :type="type"
    :enforceMaxlength="true"
    :floatingLabel="true"
    @input="updateText"
    @keydown="emitKeydown"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  />

</template>


<script>

  import uiTextbox from 'keen-ui/src/UiTextbox';

  /**
   * Handles user input.
   */
  export default {
    name: 'k-textbox',
    components: { uiTextbox },
    props: {
      /**
       * v-model
       */
      value: {
        type: [String, Number],
      },
      /**
       * Label
       */
      label: {
        type: String,
        required: true,
      },
      /**
       * Whether or not disabled
       */
      disabled: {
        type: Boolean,
        default: false,
      },
      /**
       * Whether or not required
       */
      required: {
        type: Boolean,
        default: false,
      },
      /**
       * Whether or not input is invalid
       */
      invalid: {
        type: Boolean,
        default: false,
      },
      /**
       * Text displayed if input is invalid
       */
      invalidText: {
        type: String,
        required: false,
      },
      /**
       * Whether or not to autofocus
       */
      autofocus: {
        type: Boolean,
        default: false,
      },
      /**
       * Max allowed length of input
       */
      maxlength: {
        type: Number,
        required: false,
      },
      /**
       * HTML5 autocomplete attribute (off, on, name, username, current-password, etc.)
       */
      autocomplete: {
        type: String,
        required: false,
      },
      /**
       * HTML5 type of input (text, password, number, etc.)
       */
      type: {
        type: String,
        default: 'text',
      },
    },
    data() {
      return { currentText: this.value };
    },
    watch: {
      value(val) {
        this.currentText = val;
      },
    },
    methods: {
      updateText() {
        // v-model is just a :value + @input
        /**
         * Emits input event with new value
         */
        this.$emit('input', this.currentText);
      },
      reset() {
        this.$refs.textbox.reset();
      },
      emitKeydown(e) {
        /**
         * Emits keydown event with event
         */
        this.$emit('keydown', e);
      },
    },
  };

</script>


<style lang="stylus"></style>
