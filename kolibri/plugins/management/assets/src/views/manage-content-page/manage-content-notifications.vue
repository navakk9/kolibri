<template>

  <div>
    <ui-alert
      type="success"
      v-if="notification===notificationTypes.CHANNEL_DELETE_SUCCESS"
      @dismiss="dismiss()"
    >
      {{ $tr('deleteSuccessNotification') }}
    </ui-alert>

    <ui-alert
      type="error"
      v-if="notification===notificationTypes.CHANNEL_DELETE_FAILURE"
      @dismiss="dismiss()"
    >
      {{ $tr('deleteFailureNotification') }}
    </ui-alert>

    <ui-alert
      type="success"
      v-if="notification===notificationTypes.CHANNEL_IMPORT_SUCCESS"
      @dismiss="dismiss()"
    >
      {{ $tr('successfulImportNotification') }}
    </ui-alert>
  </div>

</template>


<script>

  import { notificationTypes } from '../../constants';
  import uiAlert from 'keen-ui/src/UiAlert';
  export default {
    props: {
      notification: {
        type: String,
        required: false,
      },
    },
    components: { uiAlert },
    computed: { notificationTypes: () => notificationTypes },
    methods: {
      dismiss() {
        this.$emit('dismiss');
      },
    },
    name: 'manageContentPageNotifications',
    $trs: {
      deleteFailureNotification: 'There was a problem deleting this channel',
      deleteSuccessNotification: 'The channel has been removed from this device',
      successfulImportNotification: 'A channel has been added to this device',
    },
  };

</script>
