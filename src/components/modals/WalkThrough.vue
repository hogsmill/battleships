<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content walk-through" v-model="modals['walkThrough']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4" v-if="step == 1">
      <h4>Welcome to Agile Battleships</h4>
      <div>
        <p>
          Big thanks to <a href="https://www.linkedin.com/in/jamesscrimshire/">James Scrimshire</a> for inventing
          this game and collaborating with us in building the online version. Nice one!
          This is the classic board game with a proper agile twist! Explore why frequent and timely
          feedback makes progress that much quicker - in battleships, as in development...
        </p>
        <p>
          You will need 2 people to play this game, on 2 separate browsers/machines
        </p>
        <Facilitation />
      </div>
    </div>
    <div class="mt-4" v-if="step == 2">
      <h4>Game Setup</h4>
      <div>
        <p>
          First, both players need to set the <em>same</em> game name by clicking the
        </p>
        <div class="rounded walkthrough-button">
          Set Game Name
        </div>
        <p>button</p>
      </div>
    </div>
    <div class="mt-4" v-if="step == 3">
      <h4>Game Setup</h4>
      <div>
        <p>
          Next, both players need to set their name by clicking the
        </p>
        <div class="rounded walkthrough-button">
          Set My Name
        </div>
        <p>button</p>
      </div>
    </div>
    <div class="mt-4" v-if="step == 4">
      <h4>Game Setup</h4>
      <div>
        <p>
          Next, one player needs to click the
        </p>
        <div class="rounded walkthrough-button">
          Who is Agile?
        </div>
        <p>
          button to see who is playing "agile", and who isn't. The board should
          now look something like this:
        </p>
        <div class="game setup" />
      </div>
    </div>
    <div class="mt-4" v-if="step == 5">
      <h4>Game Setup</h4>
      <div>
        <p>
          Next, place your ships. Click on the arrow buttons for each ship to
          place horizontally or vertically.
        </p>
        <p>
          You can re-position later if you
          wish - as long as the game hasn't started...
        </p>
        <div class="game place-boat" />
      </div>
    </div>
    <div class="mt-4" v-if="step == 6">
      <h4>Game Play</h4>
      <div>
        <p>
          Once both players are happy they have positioned their boats, take your
          shots in turn. Simply click on your opponents board, and it you're "agile"
          you'll see if you've hit your opponents boat or not.
        </p>
        <p>If you're not "agile", if course, you're in the dark. Good luck!...</p>
      </div>
    </div>
    <div class="buttons" v-if="step < 6">
      <button class="btn btn-info" @click="incrementStep">
        Next
      </button>
      <button class="btn btn-info" @click="hide()">
        Skip
      </button>
    </div>
    <div class="buttons" v-if="step == 6">
      <button class="btn btn-info" @click="hide()">
        Play Game
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { $vfm, VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'

import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal,
    Facilitation
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    skip() {
      this.hide()
    },
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .walk-through {
    height: 480px;
    p {
      text-align: left;
      margin: 0 24px 12px 24px;

      &.center {
        text-align: center;
      }
    }
    ul {
      margin-bottom: 12px;

      li {
        margin: 6px 24px 12px 36px;
        text-align: left;
      }
    }
  }
</style>
