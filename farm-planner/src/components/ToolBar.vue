<template>
  <div id="tools-container">
    <div 
      class="tool-frame"
      v-for="(tool, index) in tools"
      :key="index"
      >
      <Tool :config="tool" @clicked="toolClicked"/>
    </div>
  </div>
</template>

<script>
import constants from './ToolBar/const'
import Tool from './ToolBar/Tool'

export default {
  name: 'ToolBar',
  components: { Tool },
  data () {
    return {tools: constants.tools}
  },
  methods: {
    toolClicked (action) {
      this.$emit('selected', action);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #tools-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .tool-frame {
    height: 50px;
    background-color: #1b180e;
  }
</style>
