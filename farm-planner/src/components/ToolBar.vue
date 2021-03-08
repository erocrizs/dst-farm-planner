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
  </div>
</template>

<script>
import Tool from './ToolBar/Tool'

import tools from '@/library/tools'

export default {
  name: 'ToolBar',
  components: { Tool },
  props: ['currentAction'],
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #tool-bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .tool-frame {
    height: auto;
    background-color: #1b180e;
    pointer-events: auto;
  }
</style>
