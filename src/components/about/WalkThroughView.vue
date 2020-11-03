<template>
  <div>
    <button
      v-if="walkThrough && !showAbout"
      class="btn btn-sm btn-info"
      @click="help"
    >
      Explain this for me...
    </button>
    <modal name="walk-through" id="walk-through" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
        <h4>Welcome to Agile Battleships</h4>
        <div>
          <p>
            The classic board game with an agile twist! Explore why frequent and timely
            feedback makes progress that much quicker - in battleships, as in development...
          </p>
          <p>
            You will need 2 people to play this game, on 2 separate browsers/machines
          </p>
          <p>Enjoy!</p>
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
    </modal>
  </div>
</template>

<script>
import params from '../../lib/params.js'

export default {
  data() {
    return {
      step: 1,
      default: { width: 600, height: 490 },
      positions: {
        4: { height: 400 }
      }
    }
  },
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$modal.show('walk-through')
    }
  },
  methods: {
    setDefault() {
      const elem = document.getElementsByClassName('vm--modal')[0].getBoundingClientRect()
      this.default = {
        top: elem.top,
        left: elem.left,
        width: elem.width,
        height: elem.height
      }
    },
    show() {
      this.$modal.show('walk-through')
    },
    hide() {
      this.$modal.hide('walk-through')
    },
    help() {
      this.step = 1
      this.show()
    },
    incrementStep() {
      if (this.step == 1) {
        this.setDefault()
      }
      this.step = this.step + 1
      const elem = document.getElementsByClassName('vm--modal')[0]
      let target, positions = {}
      if (this.positions[this.step] && this.positions[this.step].target) {
        target = document.getElementById(this.positions[this.step].target)
        target = target.getBoundingClientRect()
        positions.left = target.left + 30
        positions.top = target.top + 30
      } else {
        positions = this.default
      }
      if (this.positions[this.step].width) {
        positions.width = this.positions[this.step].width
      }
      if (this.positions[this.step].height) {
        positions.height = this.positions[this.step].height
      }
      elem.style.left = positions.left + 'px'
      elem.style.top = positions.top + 'px'
      elem.style.width = positions.width + 'px'
      elem.style.height = positions.height +'px'
    }
  },
}
</script>

<style lang="scss">

  .buttons {
    padding: 6px;
  }

  #walk-through p {
    margin-left: 8px;
    margin-right: 8px;
  }

  .walkthrough-button {
    background-color: #6c757d;
    width: 150px;
    color: #fff;
    padding: .25rem .5rem;
    margin: 0 auto 12px auto;
  }

  .game {
    background-repeat: no-repeat;
    background-size: contain;
    background-position-x: center;
    width: 500px;
    height: 100px;
    margin: 0 auto;
    border: 1px solid #ccc;
    margin-bottom: 12px;

    &.setup {
      background-image: url("../../assets/img/setup.jpg");
    }
    &.place-boat {
      background-image: url("../../assets/img/place.jpg");
    }
  }

</style>
