<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="https://agilesimulations.co.uk">
      <img src="/lego.png" class="ml-4" height="38px">
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <h1>
        Agile Battleships
        <span v-if="gameName">- Game: {{ gameName }}</span>
        <i v-if="gameName" title="Restart Game" @click="restartGame()" class="fas fa-undo-alt" />
        <i v-if="gameName" title="Delete Game" @click="deleteGame()" class="fas fa-trash-alt" />
      </h1>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" :class="{ active: currentTab == 'game' }">
          <a class="nav-link pointer" @click="setTab('game')">Game</a>
        </li>
        <li v-if="!gameSet" class="nav-item" :class="{ active: currentTab == 'gameWatch' }">
          <a class="nav-link pointer" @click="setTab('gameWatch')">Watch Game</a>
        </li>
        <li class="nav-item" :class="{ active: currentTab == 'results' }">
          <a class="nav-link pointer" @click="setTab('results')">Results</a>
        </li>
        <li class="nav-item" :class="{ active: currentTab == 'about' }">
          <a class="nav-link pointer" @click="setTab('about')">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link pointer" @click="show()">Feedback</a>
        </li>
        <li class="nav-item logged-in">
          <a class="nav-link pointer">
            <i v-if="!session" class="fas fa-handshake-slash" title="Not logged in" />
            <i v-if="session && !admin" class="far fa-handshake" :title="'Logged in as ' + userName" />
            <i v-if="session && admin" class="fas fa-handshake" :title="'Logged in as ' + userName + ' (Admin)'" />
          </a>
        </li>
      </ul>

      <modal name="feedback" :height="420" :classes="['rounded', 'feedback']">
        <div class="float-right mr-2 mt-1">
          <button type="button" class="close" @click="hide" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="mt-4">
          <h4>Feedback</h4>
          <p class="feedback-form">
            Thanks for playing {{ thisGame }}; we'd love to hear any feedback you have
            so that we can constantly improve things.
          </p>
          <div class="feedback-form">
            <input type="text" id="email" class="form-control" placeholder="Email (optional)">
            <br>
            <textarea id="comments" rows="6" class="form-control" placeholder="Your comments" />
            <br>
            <button class="btn btn-sm btn-secondary smaller-font" @click="sendFeedback()">
              Send Feedback
            </button>
          </div>
        </div>
      </modal>
    </div>
  </nav>
</template>

<script>
import bus from '../socket.js'

import mailFuns from '../lib/mail.js'

export default {
  computed: {
    currentTab() {
      return this.$store.getters.getCurrentTab
    },
    session() {
      return this.$store.getters.getSession
    },
    userName() {
      return this.$store.getters.getUserName
    },
    admin() {
      return this.$store.getters.getAdmin
    },
    gameSet() {
      return this.$store.getters.getGameSet
    },
    thisGame() {
      return this.$store.getters.thisGame
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  created() {
    if (location.search == '?host') {
      this.$store.dispatch('updateHost', true)
    }

    let session = localStorage.getItem('session-agilesimulations')
    if (session) {
      session = JSON.parse(session)
      this.$store.dispatch('updateSession', session.session)
      bus.$emit('sendCheckLogin', {id: this.id, session: session})
    } else {
      this.$store.dispatch('updateSession', '')
    }

    bus.$on('loginSuccess', (data) => {
      this.$store.dispatch('updateSession', data.session)
      this.$store.dispatch('updateUserName', data.userName)
      this.$store.dispatch('updateAdmin', data.loggedInAsAdmin)
    })

    bus.$on('logout', () => {
      this.$store.dispatch('updateSession', '')
      this.$store.dispatch('updateUserName', '')
      this.$store.dispatch('updateAdmin', false)
    })
  },
  methods: {
    setTab(payload) {
      this.$store.dispatch('updateTab', payload)
    },
    show () {
      this.$modal.show('feedback')
    },
    hide () {
      this.$modal.hide('feedback')
    },
    sendFeedback() {
      mailFuns.post({
        action: 'Feedback from ' + this.thisGame,
        email: encodeURIComponent(document.getElementById('email').value),
        comments: encodeURIComponent(document.getElementById('comments').value)
        },
        'Thanks for your feedback - we appreciate it!'
      )
      this.hide()
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        bus.$emit('sendRestartGame', {gameName: this.gameName})
      }
    },
    deleteGame() {
      if (confirm('Delete this game?')) {
        bus.$emit('sendDeleteGame', {gameName: this.gameName})
      }
    }
  },
}
</script>

<style lang="scss">
  nav {

    h1 {
      letter-spacing: initial;
      margin-left: 6px;
      font-weight: bold;
      text-shadow: 2px 2px 3px #444;
      font-size: xx-large;
      line-height: 1;

      span {
        margin-right: 12px;
      }

      .fas {
        margin: 0 4px;
        text-shadow: none;
        font-size: smaller;
        opacity: 0.5;

        &:hover {
          cursor: pointer;
          opacity: 1;
        }
      }
    }
  }

  .feedback {
    letter-spacing: 0;
    color: #212529;
  }

  p.feedback-form {
    margin-bottom: 12px;
  }

  .feedback-form {
    width: 80%;
    margin: 0 auto;
  }
</style>
