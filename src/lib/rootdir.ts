import * as path from 'path'
import { dirname } from 'path'

export const AmburgerApi = {
  root: {
    dir: path.join(dirname(__filename), '..', '..'),
    join(...paths: string[]): string {
      return path.join(this.dir, ...paths)
    },
  },
}
