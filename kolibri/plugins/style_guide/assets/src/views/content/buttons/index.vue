<template>

  <page-template title="Buttons" :completed="false">

    <h2><code>{{ kButtonApi.name }}</code> API</h2>
    <component-docs :api="kButtonApi" />

    <h2>Code Example</h2>
    <vue-example :code="example" />

    <h2>Guidelines</h2>

    <h3>Scope</h3>
    <p>
      This is meant to cover 90% of buttons. There will always be edge cases,
      and common sense always trumps rote rules. Maintain consistency as much as
      possible, but don’t make significant sacrifices in the UX for the sake of
      consistency.
    </p>

    <h3>Types of buttons</h3>
    <p>
      There are 3 main types of buttons, each to map to a different level of
      visual hierarchy
    </p>
    <ul>
      <li>Raised buttons for more prominent actions</li>
      <li>Flat buttons for less prominent or actions that repeat in a list</li>
      <li>Hyperlink text for very deemphasized actions or in paragraphs.</li>
    </ul>

    <h3>Dropdown buttons</h3>
    <p>
      In areas where multiple actions are necessary, raised or flat buttons
      can be made into dropdown buttons, which have multiple actions nested
      underneath them in a menu
    </p>
    <p>
      The label on a dropdown button is not an action itself, but rather
      should label the group of actions that are nested under the button
    </p>
    <p>
      If a single action is more important or prominent than the others, it
      can be brought out as its own individual button, next to the menu with
      more actions
    </p>

    <h3>Language</h3>
    <p>
      Buttons should aim to have a single word in them, with two at most
    </p>
    <p>
      The buttons language should avoid any ambiguity, be specific to the
      action you are completing. For example, use 'Save' instead of 'OK'.
    </p>
    <p>
      Never use commas or other punctuation in buttons
    </p>

    <h3>Color usage</h3>
    <p>
      Primary/affirmative actions should be purple
    </p>
    <p>
      Secondary/cancel actions should be grey
    </p>
    <p>
      Tertiary links should always use purple
    </p>

    <h3>Button placement</h3>
    <p>
      Buttons should be right aligned in modals
    </p>
    <p>
      Global actions on tables should be put above the table and right aligned
    </p>
    <p>
      Deviates from these patterns are fine with common sense
    </p>

    <h3>Iconography</h3>
    <p>
      Aside from the dropdown icon, there is no iconography in buttons
    </p>

    <h3>Responsive</h3>
    <p>
      Buttons should be determined by the size of the text in them, with a min
      width. They should not generally transform based on the size of the
      page.
    </p>
    <p>
      Buttons should elide if you really really really have but pls don’t thx
    </p>

    <h4>Language</h4>
    <ul>
      <li>Buttons should be specific to action</li>
      <li>Ideally 1 word, no more than 2 words</li>
    </ul>
    <h4>Color usage</h4>
    <ul>
      <li>Use fushia for primary actions #996189</li>
      <li>Grey for secondary action or cancel #EEEEEE</li>
    </ul>
    <h4>Iconography</h4>
    <ul>
      <li>No iconography aside from dropdown carrot</li>
    </ul>
    <h4>Placement on page</h4>
    <ul>
      <li>Right aligned on modals</li>
      <li>Top right for major creation actions</li>
    </ul>

  </page-template>

</template>


<script>

  import componentDocs from '../../shell/component-docs';
  import vueExample from '../../shell/vue-example';
  import pageTemplate from '../../shell/page-template';

  import example from 'raw-loader!./example.html';
  import kButtonApi from '!vue-doc!kolibri.coreVue.components.kButton';

  import FullVue from 'vue/dist/vue.common';
  import kButton from 'kolibri.coreVue.components.kButton';
  FullVue.component('k-button', kButton);

  export default {
    components: {
      pageTemplate,
      componentDocs,
      vueExample,
    },
    data: () => ({
      kButtonApi,
      example,
    }),
  };

</script>


<style lang="stylus" scoped></style>
