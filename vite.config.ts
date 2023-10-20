import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import tsconfigPaths from 'vite-tsconfig-paths'
import { cjsInterop } from 'vite-plugin-cjs-interop'

export default defineConfig({
  test: {
    include: [
      '**/*.{test,spec}.?(c|m)[jt]s?(x)',
      '**/*.e2e-spec.?(c|m)[jt]s?(x)',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'cobertura'],
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: 'junit.xml',
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        preserveModules: true,
      },
    },
  },
  optimizeDeps: {
    // Vite does not work well with optionnal dependencies, mark them as ignored for now
    exclude: [
      '@nestjs/platform-socket.io',
      '@nestjs/websockets',
      '@nestjs/microservices',
      'amqp-connection-manager',
      'amqplib',
      'nats',
      '@grpc/proto-loader',
      '@grpc/grpc-js',
      'redis',
      'kafkajs',
      'mqtt',
      'cache-manager',
      '@apollo',
      'class-transformer',
      'nock',
      'aws-sdk',
      'mock-aws-s3',
    ],
  },
  plugins: [
    tsconfigPaths({
      loose: true,
      root: './',
    }),
    cjsInterop({ dependencies: ['cache-manager'] }),
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      tsCompiler: 'swc',
      swcOptions: {
        swcrc: true,
        module: {
          type: 'es6',
        },
      },
    }),
  ],
})
