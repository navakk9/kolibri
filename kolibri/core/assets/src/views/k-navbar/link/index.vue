<template>

  <li>
    <router-link
      class="tab"
      :class="{ 'tab-has-icon-and-title': type === 'icon-and-title' }"
      :to="link"
    >

      <div v-if="type === 'icon' || type === 'icon-and-title'" class="tab-icon">
        <ui-icon :icon="icon" :ariaLabel="title" class="icon"/>
      </div>

      <div v-if="type === 'title' || type === 'icon-and-title'" class="tab-title">
        {{ title }}
      </div>
    </router-link>
  </li>

</template>


<script>

  import ValidateLinkObject from 'kolibri.utils.validateLinkObject';
  import uiIcon from 'keen-ui/src/UiIcon';

  /**
   Links for use inside the k-navbar
   */
  export default {
    name: 'k-navbar-link',
    props: {
      /**
        * The type of tab. title, icon, or icon-and-title.
        */
      type: {
        type: String,
        validator(type) {
          return ['title', 'icon', 'icon-and-title'].includes(type);
        },
        required: true,
      },
      /**
        * The text
        */
      title: {
        type: String,
        required: false,
      },
      /**
        * A material icon name.
        */
      icon: {
        type: String,
        required: false,
      },
      /**
        * A router link object
        */
      link: {
        type: Object,
        required: true,
        validator: ValidateLinkObject,
      },
    },
    components: { uiIcon },
  };

</script>


<style lang="stylus" scoped>

  @require '../items.styl'

</style>
