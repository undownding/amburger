import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import tsconfigPaths from 'vite-tsconfig-paths'

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
    target: 'es2020',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
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
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      tsCompiler: 'swc',
      swcOptions: {
        module: {
          type: 'es6',
        },
      },
    }),
  ],
})
