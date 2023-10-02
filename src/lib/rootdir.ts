import path from 'path'
import getRoot from 'root-dirs'

export const AmburgerApi = {
  root: {
    dir: getRoot.getPackageJsonRoot(process.cwd(), {
      baseType: 'package.json',
      logger: console.log,
    }),
    join(...paths: string[]): string {
      return path.join(this.dir, ...paths)
    },
  },
}
