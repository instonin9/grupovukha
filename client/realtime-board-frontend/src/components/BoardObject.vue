<template>
  <div
    class="board-object"
    :class="{ selected: isSelected }"
    :style="objectStyle"
    @mousedown.stop="startDrag"
    @click.stop="selectObject"
  >
    <div v-if="object.type === 'text'" class="text-content" :style="{ fontSize: (object.fontSize || 16) + 'px', color: object.color || '#000' }">
      {{ object.content || 'Текст' }}
    </div>
    <img v-if="object.type === 'image'" :src="object.src" class="image-content" draggable="false" @error="onImgError" />
    <svg v-if="object.type === 'line'" class="shape-svg" :viewBox="`0 0 ${object.width} ${object.height}`">
      <polyline
        v-if="object.points"
        :points="object.points.map(p => `${p.x},${p.y}`).join(' ')"
        :stroke="object.color || '#000'"
        :stroke-width="object.lineWidth || 2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <line v-else :x1="0" :y1="0" :x2="object.width" :y2="object.height"
        :stroke="object.color || '#000'" :stroke-width="object.lineWidth || 2" />
    </svg>
    <svg v-if="object.type === 'rect'" class="shape-svg">
      <rect width="100%" height="100%"
        :fill="object.fill || 'transparent'" :stroke="object.color || '#000'" :stroke-width="object.lineWidth || 2" />
    </svg>
    <svg v-if="object.type === 'triangle'" class="shape-svg" viewBox="0 0 100 100">
      <polygon points="50,5 95,95 5,95"
        :fill="object.fill || 'transparent'" :stroke="object.color || '#000'" :stroke-width="object.lineWidth || 2" />
    </svg>
    <svg v-if="object.type === 'circle'" class="shape-svg">
      <circle :cx="object.width/2" :cy="object.height/2" :r="Math.min(object.width, object.height)/2"
        :fill="object.fill || 'transparent'" :stroke="object.color || '#000'" :stroke-width="object.lineWidth || 2" />
    </svg>
    <button v-if="isSelected" @click.stop="$emit('delete', object.id)" class="delete-btn">×</button>
    <div v-if="isSelected" class="resize-handle tr" @mousedown.stop="startResize($event, 'tr')"></div>
    <div v-if="isSelected" class="resize-handle tl" @mousedown.stop="startResize($event, 'tl')"></div>
    <div v-if="isSelected" class="resize-handle br" @mousedown.stop="startResize($event, 'br')"></div>
    <div v-if="isSelected" class="resize-handle bl" @mousedown.stop="startResize($event, 'bl')"></div>
  </div>
</template>

<script>
export default {
  name: 'BoardObject',
  props: {
    object: { type: Object, required: true },
    isSelected: { type: Boolean, default: false }
  },
  emits: ['select', 'move', 'delete', 'resize'],
  computed: {
    objectStyle() {
      return {
        left: this.object.x + 'px',
        top: this.object.y + 'px',
        width: (this.object.width || 100) + 'px',
        height: (this.object.height || 100) + 'px'
      }
    }
  },
  methods: {
    selectObject() {
      this.$emit('select', this.object.id)
    },
    startDrag(e) {
      if (e.target.classList.contains('resize-handle')) return
      const startX = e.clientX
      const startY = e.clientY
      const objX = this.object.x
      const objY = this.object.y
      const onMouseMove = (event) => {
        this.$emit('move', {
          id: this.object.id,
          x: objX + event.clientX - startX,
          y: objY + event.clientY - startY
        })
      }
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    startResize(e, corner) {
      const startX = e.clientX
      const startY = e.clientY
      const objX = this.object.x
      const objY = this.object.y
      const objW = this.object.width || 100
      const objH = this.object.height || 100

      const onMouseMove = (event) => {
        const dx = event.clientX - startX
        const dy = event.clientY - startY
        let newX = objX
        let newY = objY
        let newW = objW
        let newH = objH

        if (corner === 'br') {
          newW = Math.max(20, objW + dx)
          newH = Math.max(20, objH + dy)
        } else if (corner === 'bl') {
          newW = Math.max(20, objW - dx)
          newH = Math.max(20, objH + dy)
          newX = objX + dx
        } else if (corner === 'tr') {
          newW = Math.max(20, objW + dx)
          newH = Math.max(20, objH - dy)
          newY = objY + dy
        } else if (corner === 'tl') {
          newW = Math.max(20, objW - dx)
          newH = Math.max(20, objH - dy)
          newX = objX + dx
          newY = objY + dy
        }

        this.$emit('resize', { id: this.object.id, x: newX, y: newY, width: newW, height: newH })
        this.$emit('move', { id: this.object.id, x: newX, y: newY })
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    onImgError(e) {
      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text x="10" y="55" font-size="14" fill="%23999">Нет фото</text></svg>'
    }
  }
}
</script>

<style scoped>
.board-object {
  position: absolute;
  user-select: none;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.board-object.selected {
  border-color: #6673ea2a;
  z-index: 10;
}

.text-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-word;
  overflow: hidden;
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
}

.shape-svg {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 11;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #667eea;
  border: 2px solid white;
  z-index: 11;
}

.resize-handle.tr { top: -5px; right: -5px; cursor: nesw-resize; }
.resize-handle.tl { top: -5px; left: -5px; cursor: nwse-resize; }
.resize-handle.br { bottom: -5px; right: -5px; cursor: nwse-resize; }
.resize-handle.bl { bottom: -5px; left: -5px; cursor: nesw-resize; }
</style>