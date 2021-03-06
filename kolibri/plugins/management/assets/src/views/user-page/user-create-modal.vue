<template>

  <core-modal
    :title="$tr('addNewAccountTitle')"
    @cancel="close"
    width="400px"
  >
    <ui-alert type="error" v-if="errorMessage" @dismiss="errorMessage = ''">{{ errorMessage }}</ui-alert>

    <form @submit.prevent="createNewUser">
      <section>
        <k-textbox
          :label="$tr('name')"
          :autofocus="true"
          :required="true"
          :maxlength="120"
          type="text"
          class="user-field"
          v-model.trim="fullName"/>
        <k-textbox
          :label="$tr('username')"
          :required="true"
          :maxlength="30"
          :invalid="usernameInvalid"
          :invalidText="usernameInvalidMsg"
          type="text"
          class="user-field"
          v-model="username"/>
        <k-textbox
          :label="$tr('password')"
          :required="true"
          type="password"
          class="user-field"
          v-model="password"/>
        <k-textbox
          :label="$tr('reEnterPassword')"
          :required="true"
          :invalid="passwordConfirmInvalid"
          :invalidText="$tr('pwMismatchError')"
          type="password"
          class="user-field"
          v-model="passwordConfirm"/>

        <ui-select
          :name="$tr('typeOfUser')"
          :label="$tr('typeOfUser')"
          :options="userKinds"
          v-model="kind"
          class="kind-select"
        />
      </section>

      <!-- Button Options at footer of modal -->
      <section class="footer">
        <k-button :text="$tr('createAccount')" :primary="true" :loading="loading" type="submit"/>
      </section>
    </form>
  </core-modal>

</template>


<script>

  import * as actions from '../../state/actions';
  import { UserKinds } from 'kolibri.coreVue.vuex.constants';
  import kButton from 'kolibri.coreVue.components.kButton';
  import coreModal from 'kolibri.coreVue.components.coreModal';
  import kTextbox from 'kolibri.coreVue.components.kTextbox';
  import uiAlert from 'keen-ui/src/UiAlert';
  import uiSelect from 'keen-ui/src/UiSelect';
  export default {
    name: 'userCreateModal',
    $trs: {
      addNewAccountTitle: 'Add new account',
      name: 'Full name',
      username: 'Username',
      password: 'Password',
      reEnterPassword: 'Re-enter password',
      typeOfUser: 'Type of user',
      createAccount: 'Create Account',
      learner: 'Learner',
      coach: 'Coach',
      admin: 'Admin',
      usernameAlreadyExists: 'Username already exists',
      usernameNotAlphaNumUnderscore: 'Username can only contain letters, numbers, and underscores',
      pwMismatchError: 'Passwords do not match',
      unknownError: 'Whoops, something went wrong. Try again',
      loadingConfirmation: 'Loading...',
    },
    components: {
      kButton,
      coreModal,
      kTextbox,
      uiAlert,
      uiSelect,
    },
    data() {
      return {
        fullName: '',
        username: '',
        password: '',
        passwordConfirm: '',
        kind: {},
        errorMessage: '',
        loading: false,
      };
    },
    mounted() {
      Object.assign(this.$data, this.$options.data());
      this.kind = {
        label: this.$tr('learner'),
        value: UserKinds.LEARNER,
      };
    },
    computed: {
      usernameAlreadyExists() {
        return this.users.findIndex(user => user.username === this.username) !== -1;
      },
      usernameIsAlphaNumUnderscore() {
        return /^\w+$/g.test(this.username);
      },
      usernameInvalid() {
        return (
          this.username !== '' && (this.usernameAlreadyExists || !this.usernameIsAlphaNumUnderscore)
        );
      },
      usernameInvalidMsg() {
        if (this.usernameAlreadyExists) {
          return this.$tr('usernameAlreadyExists');
        } else if (!this.usernameIsAlphaNumUnderscore) {
          return this.$tr('usernameNotAlphaNumUnderscore');
        }
        return '';
      },
      passwordConfirmInvalid() {
        return this.passwordConfirm !== '' && this.password !== this.passwordConfirm;
      },
      userKinds() {
        return [
          {
            label: this.$tr('learner'),
            value: UserKinds.LEARNER,
          },
          {
            label: this.$tr('coach'),
            value: UserKinds.COACH,
          },
          {
            label: this.$tr('admin'),
            value: UserKinds.ADMIN,
          },
        ];
      },
    },
    methods: {
      createNewUser() {
        this.errorMessage = '';
        if (!this.usernameInvalid && !this.passwordConfirmInvalid) {
          this.loading = true;
          const newUser = {
            username: this.username,
            full_name: this.fullName,
            kind: this.kind.value,
            password: this.password,
          };
          this.createUser(newUser).then(
            () => {
              this.close();
            },
            error => {
              this.loading = false;
              if (error.status.code === 400) {
                this.errorMessage = Object.values(error.entity)[0][0];
              } else if (error.status.code === 403) {
                this.errorMessage = error.entity;
              } else {
                this.errorMessage = this.$tr('unknownError');
              }
            }
          );
        }
      },
      close() {
        this.displayModal(false);
      },
    },
    vuex: {
      getters: { users: state => state.pageState.facilityUsers },
      actions: {
        createUser: actions.createUser,
        displayModal: actions.displayModal,
      },
    },
  };

</script>


<style lang="stylus" scoped>

  .footer
    text-align: right

  .kind-select
    margin-bottom: 3em

</style>
