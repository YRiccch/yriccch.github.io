<template>
  <section id="hobbies" class="section-container">
    <h2 class="section-title">🌟 Hobbies</h2>
    
    <div class="hobbies-content">
      <div class="chart-wrapper">
        <div ref="chartRef" class="echart-container"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import basketballIcon from '@/assets/img/Basketball.svg'
import singingIcon from '@/assets/img/Singing.svg'
import guitarIcon from '@/assets/img/Guitar.svg'
import travelIcon from '@/assets/img/Travel.svg'

const chartRef = ref(null)
let myChart = null

const hobbiesData = [
  { name: 'Basketball', icon: basketballIcon, love: 5, max: 5 },
  { name: 'Singing', icon: singingIcon, love: 3, max: 5},
  { name: 'Guitar', icon: guitarIcon, love: 3, max: 5 },
  { name: 'Travel', icon: travelIcon, love: 5, max: 5 }
]

const initChart = () => {
  if (!chartRef.value) return
  
  myChart = echarts.init(chartRef.value)
  
  // Generate configuration dynamically from data
  const indicators = hobbiesData.map(item => ({
    name: item.name,
    max: item.max
  }))

  const richConfig = hobbiesData.reduce((acc, item) => {
    acc[item.name] = {
      height: 50,
      width: 50,
      align: 'center',
      backgroundColor: {
        image: item.icon
      },
      marginBottom: 5
    }
    return acc
  }, {})

  const loveValues = hobbiesData.map(item => item.love)
  
  const option = {
    color: ['#0056b3'],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['Interest'],
      right: 0,
      top: 0,
      orient: 'vertical',
      textStyle: {
        color: 'var(--text-secondary)'
      }
    },
    radar: {
      indicator: indicators,
      center: ['50%', '50%'],
      radius: '50%',
      splitNumber: 4,
      shape: 'circle',
      axisName: {
        formatter: function (value) {
          return '{' + value + '|}\n{label|' + value + '}';
        },
        rich: {
          ...richConfig,
          label: {
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 'bold',
            align: 'center',
            padding: [5, 0, 0, 0]
          }
        }
      },
      splitArea: {
        areaStyle: {
          color: ['transparent'],
          shadowColor: 'rgba(0, 0, 0, 0)',
          shadowBlur: 0
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    series: [
      {
        name: 'Hobbies Analysis',
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        data: [
          {
            value: loveValues,
            name: 'Interest',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 86, 179, 0.4)' },
                { offset: 1, color: 'rgba(0, 86, 179, 0.1)' }
              ])
            },
            lineStyle: {
              width: 2
            }
          }
        ]
      }
    ]
  }
  
  myChart.setOption(option)
}

const handleResize = () => {
  myChart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})
</script>

<style scoped lang="scss">
.section-container {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hobbies-content {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 0rem;
}

.chart-wrapper {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  margin: 0 auto;
}

.echart-container {
  width: 100%;
  height: 100%;
}
</style>