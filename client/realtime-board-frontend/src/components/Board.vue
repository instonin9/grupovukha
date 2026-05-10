<template>
  <div class="board">
    <div class="board-header">
      <button @click="$emit('back')" class="back-btn">← Назад к списку</button>
      <h3 class="board-title">Доска: {{ boardId }}</h3>
    </div>
    <Toolbar :selectedTool="selectedTool" @select-tool="selectTool" />

    <div class="board-canvas" 
  @mousedown.self="startDraw" 
  @mousemove.self="onDraw" 
  @mouseup.self="endDraw"
  @click.self="deselectAll"
  ref="canvas">
      <BoardObject
        v-for="obj in objects"
        :key="obj.id"
        :object="obj"
        :isSelected="selectedObjectId === obj.id"
        @select="selectObject"
        @move="moveObject"
        @delete="deleteObject"
        @resize="resizeObject"
      />
      <svg v-if="drawing && selectedTool === 'line'" class="draw-preview-svg">
        <polyline
          :points="freeDrawPoints.map(p => `${p.x},${p.y}`).join(' ')"
          stroke="#667eea"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div v-if="drawing && selectedTool !== 'line'" class="draw-preview" :style="drawPreviewStyle"></div>
    </div>

    <div v-if="selectedObjectId" class="properties-panel">
      <h4>Свойства</h4>
      <div v-if="selectedObject.type === 'text'">
        <label>Текст:</label>
        <textarea v-model="selectedObject.content" @input="updateObject" placeholder="Введите текст"></textarea>
        <label>Размер шрифта:</label>
        <input type="number" v-model.number="selectedObject.fontSize" @input="updateObject" min="10" max="72" />
        <label>Цвет текста:</label>
        <input type="color" v-model="selectedObject.color" @input="updateObject" />
      </div>
      <div v-if="['line', 'rect', 'triangle', 'circle'].includes(selectedObject.type)">
        <label>Цвет:</label>
        <input type="color" v-model="selectedObject.color" @input="updateObject" />
        <label>Толщина:</label>
        <input type="number" v-model.number="selectedObject.lineWidth" @input="updateObject" min="1" max="10" />
        <label v-if="['rect', 'triangle', 'circle'].includes(selectedObject.type)">
          Заливка:
          <input type="color" v-model="selectedObject.fill" @input="updateObject" />
        </label>
      </div>
      <div v-if="selectedObject.type === 'image'">
        <label>URL изображения:</label>
        <input type="text" v-model="selectedObject.src" @input="updateObject" placeholder="https://..." />
      </div>
      <div>
        <label>Ширина:</label>
        <input type="number" v-model.number="selectedObject.width" @input="updateObject" min="20" />
        <label>Высота:</label>
        <input type="number" v-model.number="selectedObject.height" @input="updateObject" min="20" />
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from './Toolbar.vue'
import BoardObject from './BoardObject.vue'
import socket from '../socket/socket'

export default {
  name: 'Board',
  components: { Toolbar, BoardObject },
  props: {
    boardId: { type: String, required: true }
  },
  emits: ['back'],
  data() {
    return {
      objects: [],
      selectedTool: null,
      selectedObjectId: null,
      drawing: false,
      drawStart: { x: 0, y: 0 },
      drawCurrent: { x: 0, y: 0 },
      freeDrawPoints: []
    }
  },
  computed: {
    selectedObject() {
      return this.objects.find(o => o.id === this.selectedObjectId)
    },
    drawPreviewStyle() {
      const x = Math.min(this.drawStart.x, this.drawCurrent.x)
      const y = Math.min(this.drawStart.y, this.drawCurrent.y)
      const w = Math.abs(this.drawCurrent.x - this.drawStart.x) || 2
      const h = Math.abs(this.drawCurrent.y - this.drawStart.y) || 2
      return {
        left: x + 'px',
        top: y + 'px',
        width: w + 'px',
        height: h + 'px'
      }
    }
  },
  methods: {
    selectTool(type) {
      this.selectedTool = type
      this.selectedObjectId = null
    },
    getCanvasPos(e) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    },
    startDraw(e) {
      if (!this.selectedTool) return
      this.drawing = true
      const pos = this.getCanvasPos(e)
      this.drawStart = pos
      this.drawCurrent = pos

      if (this.selectedTool === 'line') {
        this.freeDrawPoints = [pos]
      }
    },
    onDraw(e) {
      if (!this.drawing) return
      const pos = this.getCanvasPos(e)
      this.drawCurrent = pos

      if (this.selectedTool === 'line') {
        this.freeDrawPoints.push(pos)
      }
    },
    endDraw(e) {
      if (!this.drawing) return
      this.drawing = false

      if (this.selectedTool === 'line') {
        const end = this.getCanvasPos(e)
        this.freeDrawPoints.push(end)

        if (this.freeDrawPoints.length < 2) {
          this.freeDrawPoints = []
          return
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        this.freeDrawPoints.forEach(p => {
          if (p.x < minX) minX = p.x
          if (p.y < minY) minY = p.y
          if (p.x > maxX) maxX = p.x
          if (p.y > maxY) maxY = p.y
        })

        const points = this.freeDrawPoints.map(p => ({
          x: p.x - minX,
          y: p.y - minY
        }))

        const newObj = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          type: 'line',
          x: minX,
          y: minY,
          width: maxX - minX || 2,
          height: maxY - minY || 2,
          color: '#000000',
          lineWidth: 2,
          points: points
        }

        this.objects.push(newObj)
        socket.emit('create-object', { boardId: this.boardId, object: newObj })
        this.freeDrawPoints = []
        return
      }

      const end = this.getCanvasPos(e)
      const x = Math.min(this.drawStart.x, end.x)
      const y = Math.min(this.drawStart.y, end.y)
      const w = Math.abs(end.x - this.drawStart.x) || 100
      const h = Math.abs(end.y - this.drawStart.y) || 100

      const newObj = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        type: this.selectedTool,
        x: x,
        y: y,
        width: w,
        height: h,
        color: '#000000',
        lineWidth: 2,
        fill: 'transparent',
        content: 'Текст',
        fontSize: 16,
        src: ''
      }

      this.objects.push(newObj)
      socket.emit('create-object', { boardId: this.boardId, object: newObj })
    },
    selectObject(id) {
      this.selectedObjectId = id
      this.selectedTool = null
    },

deselectAll(e) {
  if (e.target === this.$refs.canvas) {
    this.selectedObjectId = null
  }
},

    moveObject(data) {
      const obj = this.objects.find(o => o.id === data.id)
      if (obj) {
        obj.x = data.x
        obj.y = data.y
        socket.emit('move-object', { boardId: this.boardId, id: data.id, x: data.x, y: data.y })
      }
    },

    resizeObject(data) {
      const obj = this.objects.find(o => o.id === data.id)
      if (obj) {
        obj.width = data.width
        obj.height = data.height
        socket.emit('update-object', { boardId: this.boardId, object: { ...obj } })
      }
    },
    updateObject() {
      const obj = this.objects.find(o => o.id === this.selectedObjectId)
      if (obj) {
        socket.emit('update-object', { boardId: this.boardId, object: { ...obj } })
      }
    },
    deleteObject(id) {
      this.objects = this.objects.filter(o => o.id !== id)
      this.selectedObjectId = null
      socket.emit('delete-object', { boardId: this.boardId, id })
    }
  },
  mounted() {
    socket.on('board-data', (board) => {
      if (board.objects) {
        this.objects = board.objects
      }
    })

    socket.on('object-created', (object) => {
      if (!this.objects.find(o => o.id === object.id)) {
        this.objects.push(object)
      }
    })
    socket.on('object-updated', (object) => {
      const index = this.objects.findIndex(o => o.id === object.id)
      if (index !== -1) {
        this.objects[index] = { ...object }
      }
    })
    socket.on('object-moved', (data) => {
      const obj = this.objects.find(o => o.id === data.id)
      if (obj) {
        obj.x = data.x
        obj.y = data.y
      }
    })
    socket.on('object-deleted', (id) => {
      this.objects = this.objects.filter(o => o.id !== id)
      if (this.selectedObjectId === id) {
        this.selectedObjectId = null
      }
    })
  }
}
</script>

<style scoped>
.board {
  width: 100%;
  padding: 10px;
}

.board-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
}

.back-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #77777752 0%, #9797978c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(167, 167, 167, 0.5);
}

.board-title {
  color: white;
  margin: 0;
  font-weight: 400;
  font-size: 18px;
}

.board-canvas {
  width: 100%;
  height: 70vh;
  background: #ffffff;
  border: 2px solid #ddd;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin-top: 12px;
}

.draw-preview {
  position: absolute;
  border: 2px dashed #909cd4;
  background: rgba(102, 126, 234, 0.1);
  pointer-events: none;
  z-index: 100;
}

.draw-preview-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.properties-panel {
  margin-top: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ddd;
  border-radius: 12px;
  color: #333;
}

.properties-panel h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

.properties-panel label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.properties-panel input[type="color"] {
  vertical-align: middle;
  margin-left: 8px;
  width: 40px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.properties-panel input[type="number"] {
  width: 70px;
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
}

.properties-panel input[type="text"] {
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  margin-top: 4px;
}

.properties-panel textarea {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  resize: vertical;
  min-height: 60px;
  margin-top: 4px;
}
</style>