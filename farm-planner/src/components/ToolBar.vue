<template>
  <div id="tool-bar">
    <div 
      class="tool-frame"
      v-for="(tool, index) in tools"
      :key="index">
      <Tool
        :config="tool"
        :selected="isSelected(tool)"
        @clicked="toolClicked"/>
    </div>
    <div class="action-stack-button">
      <div id="undo-button" class="tool-frame" :class="{'disable-action': !undoable}">
        <img :src="imgSrc('undo')" @click="undo"/>
      </div>
      <div 
        id="redo-button"
        class="tool-frame"
        :class="{'disable-action': !redoable}">
        <img :src="imgSrc('redo')" @click="redo"/>
      </div>
    </div>
  </div>
</template>

<script>
import Tool from './ToolBar/Tool'

import tools from '@/library/tools'
import {getResourcePath} from '@/library/util'

export default {
  name: 'ToolBar',
  components: { Tool },
  props: [
    'currentAction',
    'undoable',
    'redoable'
  ],
  data () {
    return {
      tools: tools
    }
  },
  methods: {
    toolClicked (action) {
      this.$emit('selectAction', action)
    },
    isSelected (toolConfig) {
      return toolConfig.action === this.currentAction
    },
    imgSrc (action) {
      return getResourcePath(`toolbar/${action}.png`)
    },
    undo () {
      if (this.undoable) {
        this.$emit('undo')
      }
    },
    redo () {
      if (this.redoable) {
        this.$emit('redo')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #tool-bar, .action-stack-button {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .tool-frame {
    height: auto;
    background-color: #1b180e;
    pointer-events: auto;
  }
  
  #undo-button img, #redo-button img {
    display: block;
    position: relative;

    width: 100%;
    height: 100%;
  }

  #undo-button, #redo-button {
    display: block;
    position: relative;

    width: 50px;
    height: 50px;
  }

  #undo-button::before, #redo-button::before {
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background-image: url("../assets/toolbar/tool_bg.png");
    background-size: cover;
  }

  .disable-action::before, .disable-action::before {
    filter: grayscale(100%);
  }

  .disable-action img {
    opacity: 0.7;
  }
  
  .action-stack-button {
    width: 100%;
  }

  @media screen and (min-width: 780px) {
    .action-stack-button {
      width: auto;
    }
  }
</style>
