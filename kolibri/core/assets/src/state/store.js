import { UserKinds } from '../constants';

const baseLoggingState = {
  summary: { progress: 0 },
  session: {},
  mastery: {},
  attempt: {},
};

const baseSessionState = {
  id: undefined,
  username: '',
  full_name: '',
  user_id: undefined,
  facility_id: undefined,
  kind: [UserKinds.ANONYMOUS],
  can_manage_content: false,
};

// core state is namespaced, and merged with a particular app's state
const initialState = {
  core: {
    error: '',
    loading: true,
    title: '',
    pageSessionId: 0,
    session: baseSessionState,
    loginError: null,
    logging: baseLoggingState,
    totalProgress: null,
    channels: {
      list: [],
      currentId: null,
    },
    facilityConfig: {},
    facilities: [],
  },
};

const mutations = {
  CORE_SET_SESSION(state, value) {
    Object.assign(state.core.session, value);
  },
  CORE_SET_FACILITY_CONFIG(state, facilityConfig) {
    state.core.facilityConfig = facilityConfig;
  },
  CORE_SET_FACILITIES(state, facilities) {
    state.core.facilities = facilities;
  },
  // Makes settings for wrong credentials 401 error
  CORE_SET_LOGIN_ERROR(state, value) {
    state.core.loginError = value;
  },
  CORE_CLEAR_SESSION(state) {
    Object.assign(state.core.session, baseSessionState);
  },
  CORE_SET_PAGE_LOADING(state, value) {
    const update = { loading: value };
    if (value) {
      Object.assign(update, { pageSessionId: state.core.pageSessionId + 1 });
    }
    Object.assign(state.core, update);
  },
  CORE_SET_ERROR(state, error) {
    state.core.error = error;
  },
  CORE_SET_TITLE(state, title) {
    state.core.title = title;
  },
  SET_LOGGING_SUMMARY_STATE(state, summaryState) {
    state.core.logging.summary = summaryState;
  },
  SET_LOGGING_SUMMARY_ID(state, summaryId) {
    state.core.logging.summary.id = summaryId;
  },
  SET_LOGGING_SESSION_ID(state, sessionId) {
    state.core.logging.session.id = sessionId;
  },
  SET_LOGGING_SESSION_STATE(state, sessionState) {
    state.core.logging.session = sessionState;
  },
  SET_LOGGING_PROGRESS(state, sessionProgress, summaryProgress) {
    state.core.logging.session.progress = sessionProgress;
    state.core.logging.summary.progress = summaryProgress;
  },
  SET_LOGGING_COMPLETION_TIME(state, time) {
    state.core.logging.summary.completion_timestamp = time;
  },
  SET_LOGGING_TIME(state, sessionTime, summaryTime, currentTime) {
    state.core.logging.session.end_timestamp = currentTime;
    state.core.logging.summary.end_timestamp = currentTime;
    state.core.logging.session.time_spent = sessionTime;
    state.core.logging.summary.time_spent = summaryTime;
  },
  SET_LOGGING_PENDING(state, summaryPending, sessionPending) {
    state.core.logging.summary.pending_create = summaryPending;
    state.core.logging.session.pending_create = sessionPending;
  },
  SET_LOGGING_THRESHOLD_CHECKS(state, progress, timeSpent) {
    state.core.logging.session.total_time_at_last_save = timeSpent;
    state.core.logging.session.progress_at_last_save = progress;
  },
  SET_LOGGING_MASTERY_STATE(state, masteryState) {
    state.core.logging.mastery = masteryState;
  },
  SET_LOGGING_MASTERY_COMPLETE(state, completetime) {
    state.core.logging.mastery.complete = true;
    state.core.logging.mastery.completion_timestamp = completetime;
  },
  SET_LOGGING_ATTEMPT_STATE(state, attemptState) {
    state.core.logging.attempt = attemptState;
  },
  SET_LOGGING_ATTEMPT_STARTTIME(state, starttime) {
    state.core.logging.attempt.start_timestamp = starttime;
  },
  UPDATE_LOGGING_ATTEMPT_INTERACTION_HISTORY(state, action) {
    state.core.logging.attempt.interaction_history.push(action);
  },
  UPDATE_LOGGING_MASTERY(state, currentTime, correct, firstAttempt, hinted) {
    if (firstAttempt) {
      state.core.logging.mastery.totalattempts += 1;
      state.core.logging.mastery.pastattempts.unshift({ correct, hinted });
    }
    state.core.logging.mastery.end_timestamp = currentTime;
  },
  UPDATE_LOGGING_ATTEMPT(
    state,
    { currentTime, correct, firstAttempt, complete, hinted, answerState, simpleAnswer }
  ) {
    if (complete) {
      state.core.logging.attempt.completion_timestamp = currentTime;
      state.core.logging.attempt.complete = true;
    } else {
      state.core.logging.attempt.completion_timestamp = null;
      state.core.logging.attempt.complete = false;
    }
    state.core.logging.attempt.end_timestamp = currentTime;
    let starttime = state.core.logging.attempt.start_timestamp;
    if (typeof starttime === 'string') {
      starttime = new Date(starttime);
    }
    state.core.logging.attempt.time_spent = currentTime - starttime;
    if (firstAttempt) {
      // Can only get it correct on the first try.
      state.core.logging.attempt.correct = correct;
      state.core.logging.attempt.hinted = hinted;
      state.core.logging.attempt.answer = answerState;
      state.core.logging.attempt.simple_answer = simpleAnswer;
    } else if (state.core.logging.attempt.correct < 1) {
      // Only set hinted if attempt has not already been marked as correct
      // and set it to true if now true, but leave as true if false.
      state.core.logging.attempt.hinted = state.core.logging.attempt.hinted || hinted;
    }
  },
  SET_EMPTY_LOGGING_STATE(state) {
    state.core.logging.summary = { progress: 0 };
    state.core.logging.session = {};
    state.core.logging.mastery = {};
    state.core.logging.attempt = {};
  },
  SET_TOTAL_PROGRESS(state, progress) {
    state.core.totalProgress = progress;
  },
  SET_CORE_CURRENT_CHANNEL(state, channelId) {
    state.core.channels.currentId = channelId;
  },
  SET_CORE_CHANNEL_LIST(state, channelList) {
    state.core.channels.list = channelList;
  },
};

export { initialState, mutations };
