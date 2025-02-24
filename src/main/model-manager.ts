import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { ModelCategory } from '../shared/models'
import { modelSizes } from '../shared/constants'

const root = path.join(os.homedir(), '.autotitles')
export const modelsDir = path.join(root, 'models')
const ext = '.bin'

// Ensure the models directory exists.
fs.mkdirSync(modelsDir, { recursive: true })

export async function deleteModel(model: string) {
  const modelPath = path.join(modelsDir, `ggml-${model}.bin`)

  try {
    if (fs.existsSync(modelPath)) {
      await fs.promises.unlink(modelPath)
    }
  } catch (error) {
    console.error(`Error deleting model ${model}:`, error)
    throw error
  }
}

export function getModelList(): ModelCategory[] {
  // Read files from the models directory and filter by extension.
  const files = fs.readdirSync(modelsDir).filter((file) => file.endsWith(ext))
  // Remove the extension and any "ggml-" prefix.
  const downloadedIds = files.map((file) => file.slice(0, -ext.length).replace('ggml-', ''))
  // Create a set for quick lookup.
  const downloadedSet = new Set(downloadedIds)

  const modelLookup = new Map<string, (typeof MODELLIST)[number]['items'][number]>()
  MODELLIST.forEach((category) => {
    category.items.forEach((model) => {
      modelLookup.set(model.id, model)
    })
  })

  // Update all non-downloaded categories so that if a model is downloaded,
  // its disabled property is set to false.
  const updatedCategories = MODELLIST.map((category) => ({
    ...category,
    items: category.items.map((model) =>
      downloadedSet.has(model.id) ? { ...model, disabled: false } : model
    )
  }))

  return [...updatedCategories]
}

const BASE_MODELS_URL = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main'

export const MODELS = {
  tiny: `${BASE_MODELS_URL}/ggml-tiny.bin`,
  'tiny.en': `${BASE_MODELS_URL}/ggml-tiny.en.bin`,
  small: `${BASE_MODELS_URL}/ggml-small.bin`,
  'small.en': `${BASE_MODELS_URL}/ggml-small.en.bin`,
  base: `${BASE_MODELS_URL}/ggml-base.bin`,
  'base.en': `${BASE_MODELS_URL}/ggml-base.en.bin`,
  medium: `${BASE_MODELS_URL}/ggml-medium.bin`,
  'medium.en': `${BASE_MODELS_URL}/ggml-medium.en.bin`,
  'large-v1': `${BASE_MODELS_URL}/ggml-large-v1.bin`,
  'large-v2': `${BASE_MODELS_URL}/ggml-large-v2.bin`,
  'large-v3': `${BASE_MODELS_URL}/ggml-large-v3.bin`,
  'large-v3-turbo': `${BASE_MODELS_URL}/ggml-large-v3-turbo.bin`
} as const

export const MODEL_TO_ALIGNMENT_PRESET: Record<keyof typeof MODELS, number> = {
  'tiny.en': 3, // WHISPER_AHEADS_TINY_EN
  tiny: 4, // WHISPER_AHEADS_TINY
  'base.en': 5, // WHISPER_AHEADS_BASE_EN
  base: 6, // WHISPER_AHEADS_BASE
  'small.en': 7, // WHISPER_AHEADS_SMALL_EN
  small: 8, // WHISPER_AHEADS_SMALL
  'medium.en': 9, // WHISPER_AHEADS_MEDIUM_EN
  medium: 10, // WHISPER_AHEADS_MEDIUM
  'large-v1': 11, // WHISPER_AHEADS_LARGE_V1
  'large-v2': 12, // WHISPER_AHEADS_LARGE_V2
  'large-v3': 13, // WHISPER_AHEADS_LARGE_V3
  'large-v3-turbo': 13 // Using LARGE_V3 preset for turbo variant
} as const

export const MODELLIST: ModelCategory[] = [
  {
    id: 'multilingual',
    items: [
      {
        id: 'tiny',
        label: 'Tiny (Multilingual)',
        url: MODELS.tiny,
        description:
          'Fastest and most lightweight multilingual model. Perfect for quick transcriptions on devices with limited resources. Uses ~1GB memory and runs about 10x faster than large models.',
        disabled: true,
        size: modelSizes['tiny'],
        type: 'multilingual'
      },
      {
        id: 'small',
        label: 'Small (Multilingual)',
        url: MODELS.small,
        description:
          'Good balance between speed and accuracy for multilingual use. Requires ~1GB memory and runs about 4x faster than large models.',
        disabled: true,
        size: modelSizes['small'],
        type: 'multilingual'
      },
      {
        id: 'base',
        label: 'Base (Multilingual)',
        url: MODELS.base,
        description:
          'Entry-level multilingual model with decent accuracy. Uses ~2GB memory and runs about 7x faster than large models.',
        disabled: true,
        size: modelSizes['base'],
        type: 'multilingual'
      },
      {
        id: 'medium',
        label: 'Medium (Multilingual)',
        url: MODELS.medium,
        description:
          'High-accuracy multilingual model with reasonable speed. Requires ~5GB memory and runs about 2x faster than large models.',
        disabled: true,
        size: modelSizes['medium'],
        type: 'multilingual'
      },
      {
        id: 'large-v1',
        label: 'Large v1',
        url: MODELS['large-v1'],
        description:
          'Original large model with highest accuracy but slower processing. Requires ~10GB memory. Best for tasks where accuracy is critical.',
        disabled: true,
        size: modelSizes['large-v1'],
        type: 'multilingual'
      },
      {
        id: 'large-v2',
        label: 'Large v2',
        url: MODELS['large-v2'],
        description:
          'Improved version of the large model with better accuracy across languages. Requires ~10GB memory.',
        disabled: true,
        size: modelSizes['large-v2'],
        type: 'multilingual'
      },
      {
        id: 'large-v3',
        label: 'Large v3',
        url: MODELS['large-v3'],
        description:
          'Latest version of the large model with best overall accuracy. Requires ~10GB memory.',
        disabled: true,
        size: modelSizes['large-v3'],
        type: 'multilingual'
      },
      {
        id: 'large-v3-turbo',
        label: 'Large v3 Turbo',
        url: MODELS['large-v3-turbo'],
        description:
          'Optimized version of large-v3 that runs about 8x faster with minimal accuracy loss. Requires ~6GB memory. Great for when you need both speed and accuracy.',
        disabled: true,
        size: modelSizes['large-v3-turbo'],
        type: 'multilingual'
      }
    ]
  },
  {
    id: 'english',
    items: [
      {
        id: 'tiny.en',
        label: 'Tiny (English)',
        url: MODELS['tiny.en'],
        description:
          'Fastest English-only model with improved accuracy over multilingual tiny. Uses ~1GB memory and runs about 10x faster than large models. Ideal for quick English transcriptions.',
        disabled: true,
        size: modelSizes['tiny.en'],
        type: 'english'
      },
      {
        id: 'small.en',
        label: 'Small (English)',
        url: MODELS['small.en'],
        description:
          'English-optimized model with good balance of speed and accuracy. Requires ~1GB memory and runs about 4x faster than large models.',
        disabled: true,
        size: modelSizes['small.en'],
        type: 'english'
      },
      {
        id: 'base.en',
        label: 'Base (English)',
        url: MODELS['base.en'],
        description:
          'English-focused model with better accuracy than multilingual base. Uses ~2GB memory and runs about 7x faster than large models.',
        disabled: true,
        size: modelSizes['base.en'],
        type: 'english'
      },
      {
        id: 'medium.en',
        label: 'Medium (English)',
        url: MODELS['medium.en'],
        description:
          'High-accuracy English-only model. Requires ~5GB memory and runs about 2x faster than large models. Similar performance to multilingual medium.',
        disabled: true,
        size: modelSizes['medium.en'],
        type: 'english'
      }
    ]
  }
]
