<template>

  <div>

    <page-header :title="content.title">
    </page-header>

    <content-renderer
      v-if="!content.assessment"
      v-show="!searchOpen"
      class="content-renderer"
      @sessionInitialized="setWasIncomplete"
      @startTracking="startTracking"
      @stopTracking="stopTracking"
      @updateProgress="updateProgress"
      :id="content.id"
      :kind="content.kind"
      :files="content.files"
      :contentId="content.content_id"
      :channelId="channelId"
      :available="content.available"
      :extraFields="content.extra_fields"
      :initSession="initSession">
      <k-button :primary="true" @click="nextContentClicked" v-if="showNextBtn" class="float" :text="$tr('nextContent')" alignment="right"/>
    </content-renderer>

    <assessment-wrapper
      v-else
      v-show="!searchOpen"
      class="content-renderer"
      @sessionInitialized="setWasIncomplete"
      @startTracking="startTracking"
      @stopTracking="stopTracking"
      @updateProgress="updateProgress"
      :id="content.id"
      :kind="content.kind"
      :files="content.files"
      :contentId="content.content_id"
      :channelId="channelId"
      :available="content.available"
      :extraFields="content.extra_fields"
      :initSession="initSession">
      <k-button :primary="true" @click="nextContentClicked" v-if="showNextBtn" class="float" :text="$tr('nextContent')" alignment="right"/>
    </assessment-wrapper>

    <p v-html="description"></p>


    <div class="metadata">
      <p v-if="content.author">
        {{ $tr('author') }}: {{ content.author }}
      </p>

      <p v-if="content.license" >
        {{ $tr('license') }}: {{ content.license }}

        <template v-if="content.license_description">
          <span ref="licensetooltip">
            <ui-icon icon="info_outline" :ariaLabel="$tr('licenseDescription')" class="license-tooltip"/>
          </span>

          <ui-popover trigger="licensetooltip" class="license-description">
            {{ content.license_description }}
          </ui-popover>
        </template>

      </p>

      <p v-if="content.license_owner">
        {{ $tr('copyrightHolder') }}: {{ content.license_owner }}
      </p>
    </div>

    <download-button v-if="canDownload" :files="content.files" class="download-button"/>

    <content-card-group-carousel
      v-if="showRecommended"
      :gen-content-link="genContentLink"
      :header="recommendedText"
      :contents="recommended"/>

    <template v-if="progress >= 1 && wasIncomplete">
      <points-popup
        v-if="showPopup"
        @close="markAsComplete"
        :kind="content.next_content.kind"
        :title="content.next_content.title">
        <k-button :primary="true" slot="nextItemBtn" @click="nextContentClicked" :text="$tr('nextContent')" alignment="right"/>
      </points-popup>

      <transition v-else name="slidein" appear>
        <points-slidein @close="markAsComplete"/>
      </transition>
    </template>

  </div>

</template>


<script>

  import {
    initContentSession as initSessionAction,
    updateProgress as updateProgressAction,
    startTrackingProgress as startTracking,
    stopTrackingProgress as stopTracking,
  } from 'kolibri.coreVue.vuex.actions';
  import { PageNames, PageModes } from '../../constants';
  import { pageMode } from '../../state/getters';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import { isSuperuser } from 'kolibri.coreVue.vuex.getters';
  import { updateContentNodeProgress } from '../../state/actions/main';
  import pageHeader from '../page-header';
  import contentCardGroupCarousel from '../content-card-group-carousel';
  import contentRenderer from 'kolibri.coreVue.components.contentRenderer';
  import downloadButton from 'kolibri.coreVue.components.downloadButton';
  import kButton from 'kolibri.coreVue.components.kButton';
  import assessmentWrapper from '../assessment-wrapper';
  import pointsPopup from '../points-popup';
  import pointsSlidein from '../points-slidein';
  import uiPopover from 'keen-ui/src/UiPopover';
  import uiIcon from 'keen-ui/src/UiIcon';
  import markdownIt from 'markdown-it';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';

  export default {
    name: 'learnContent',
    $trs: {
      recommended: 'Recommended',
      nextContent: 'Go to next item',
      author: 'Author',
      license: 'License',
      licenseDescription: 'License description',
      copyrightHolder: 'Copyright holder',
    },
    data: () => ({ wasIncomplete: false }),
    computed: {
      /**
        * Detects whether an Android device is using WebView.
        * Based on https://developer.chrome.com/multidevice/user-agent#webview_user_agent
        */
      isAndroidWebView() {
        const ua = window.navigator.userAgent;
        const isAndroid = /Android/.test(ua);

        if (isAndroid) {
          const androidVersion = parseFloat(ua.match(/Android\s([0-9\.]*)/)[1]);
          const isChrome = /Chrome/.test(ua);

          // WebView UA in Lollipop and Above
          // Android >=5.0
          if (androidVersion >= 5.0 && isChrome && /wv/.test(ua)) {
            return true;
          }

          // WebView UA in KitKat to Lollipop
          // Android >= 4.4
          if (androidVersion >= 4.4 && androidVersion < 5.0 && isChrome && /Version\//.test(ua)) {
            return true;
          }

          // Old WebView UA
          // Android < 4.4
          if (androidVersion < 4.4 && /Version\//.test(ua) && /\/534.30/.test(ua)) {
            return true;
          }
        }

        return false;
      },
      canDownload() {
        if (this.content) {
          return this.content.kind !== ContentNodeKinds.EXERCISE && !this.isAndroidWebView;
        }
        return false;
      },
      description() {
        if (this.content) {
          const md = new markdownIt('zero', { breaks: true });
          return md.render(this.content.description);
        }
      },
      showNextBtn() {
        return this.progress >= 1 && this.content && this.nextContentLink;
      },
      recommendedText() {
        return this.$tr('recommended');
      },
      progress() {
        if (!this.isSuperuser) {
          return this.summaryProgress;
        }
        return this.sessionProgress;
      },
      nextContentLink() {
        if (this.content.next_content) {
          return this.genContentLink(this.content.next_content.id, this.content.next_content.kind);
        }
        return null;
      },
      showRecommended() {
        if (this.recommended && this.pageMode === PageModes.LEARN) {
          return true;
        }
        return false;
      },
      showPopup() {
        return (
          this.content.kind === ContentNodeKinds.EXERCISE ||
          this.content.kind === ContentNodeKinds.VIDEO ||
          this.content.kind === ContentNodeKinds.AUDIO
        );
      },
    },
    components: {
      pageHeader,
      contentCardGroupCarousel,
      contentRenderer,
      downloadButton,
      kButton,
      assessmentWrapper,
      pointsPopup,
      pointsSlidein,
      uiPopover,
      uiIcon,
    },
    methods: {
      nextContentClicked() {
        this.$router.push(this.nextContentLink);
      },
      setWasIncomplete() {
        this.wasIncomplete = this.progress < 1;
      },
      initSession() {
        return this.initSessionAction(this.channelId, this.contentId, this.content.kind);
      },
      updateProgress(progressPercent, forceSave = false) {
        const summaryProgress = this.updateProgressAction(progressPercent, forceSave);
        updateContentNodeProgress(this.channelId, this.contentNodeId, summaryProgress);
      },
      markAsComplete() {
        this.wasIncomplete = false;
      },
      genContentLink(id, kind) {
        if (kind === 'topic') {
          return {
            name: PageNames.EXPLORE_TOPIC,
            params: { channel_id: this.channelId, id },
          };
        }
        return {
          name: PageNames.LEARN_CONTENT,
          params: { channel_id: this.channelId, id },
        };
      },
    },
    beforeDestroy() {
      this.stopTracking();
    },
    vuex: {
      getters: {
        searchOpen: state => state.searchOpen,
        content: state => state.pageState.content,
        contentId: state => state.pageState.content.content_id,
        contentNodeId: state => state.pageState.content.id,
        channelId: state => state.core.channels.currentId,
        pagename: state => state.pageName,
        recommended: state => state.pageState.recommended,
        summaryProgress: state => state.core.logging.summary.progress,
        sessionProgress: state => state.core.logging.session.progress,
        pageMode,
        isSuperuser,
      },
      actions: {
        initSessionAction,
        updateProgressAction,
        startTracking,
        stopTracking,
      },
    },
  };

</script>


<style lang="stylus" scoped>

  @require '~kolibri.styles.definitions'

  .float
    float: right

  .metadata
    font-size: smaller

  .download-button
    display: block

  .license-tooltip
    cursor: pointer
    font-size: 1.25em
    color: $core-action-dark

  .license-description
    max-width: 300px
    padding: 1em
    font-size: smaller

</style>
