import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components
 * 
 * States:
 *  filter
 *  posts
 *  workSessions
 *  outgoingFriendRequests
 *  incomingFriendRequests
 *  friends
 *  username
 *  point
 *  alerts
 */
const store = new Vuex.Store({
  state: {
    // Post and post filtering
    filter: null,
    posts: [], // Frontend: (PostComponent -> PostPage) 

    // Work session
    workSessions: [], // Frontend: (SessionComponent -> SessionPage)

    // Friend and friend requests
    outgoingFriendRequests: [], // Frontend: (FriendRequestOutComponent -> FriendPage)
    incomingFriendRequests: [], // Frontend: (FriendRequestInComponent -> FriendPage)
    friends: [],             // Frontend: (FriendsComponent -> FriendPage)

    // User and user session (not work session, this is cookie!)
    username: null,
    point: 0,
    alerts: {},
    drawings: [],
  },
  mutations: {
    /** SET (for refresh persist @blockform) */
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setPoint(state, point) {
      /**
       * Update the stored point to the specified one.
       * @param username - new point to set
       */
      state.point = point;
    },

    /** UPDATE (MIGHT NOT BE NEEDED) */
    updateFilter(state, filter) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.filter = filter;
    },
    updatePosts(state, posts) {
      /**
       * Update the stored posts to the provided posts.
       * @param posts - Posts to store
       */
      state.posts = posts;
    },
    updateDrawings(state, drawings) {//TODO Where use??
      /**
       * Update the stored drawings to the provided drawings.
       * @param drawings - Posts to store
       */
      state.drawings = drawings;
    },
    updateSessions(state, sessions) {
      /**
       * Update the stored workSessions to the provided workSessions.
       * @param workSessions - workSessions to store
       */
      state.workSessions = workSessions;
    },
    updatePoint(state, point) {
      /**
       * Update the stored posts filter to the specified one.
       * @param filter - Username of the user to fitler posts by
       */
      state.point = point;
    },

    /** REFRESH **/
    async refreshPosts(state) {
      /**
       * Request the server for the currently available posts.
       */
      const url = state.filter ? `/api/users/${state.filter}/posts` : '/api/posts';
      const res = await fetch(url).then(async r => r.json());
      state.posts = res;
    },
    // Friend and friend requests
    async refreshOutFriendRequest(state) {
      /**
       * Get all currently outgoing friend requests.
       */
      const url = `/api/friendRequest?requestDirection=Out`;
      const res = await fetch(url).then(async r => r.json());
      state.outgoingFriendRequests = res.requests;
    },
    async refreshInFriendRequest(state) {
      /**
       * Get all currently incoming friend requests.
       */
      const url = `/api/friendRequest?requestDirection=In`;
      const res = await fetch(url).then(async r => r.json());
      state.incomingFriendRequests = res.requests;
    },
    async refreshFriends(state) {
      /**
       * Get all currently made friends (users in a friendship with the current user)
       */
      console.log('can I see store? YES')
      const url = `/api/friendship`;
      const res = await fetch(url).then(async r => r.json());
      state.friends = res.friendships; // From router response
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
