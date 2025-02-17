/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { registerTelemetryUsageCollector } from './telemetry';
import { createCollectorFetchContextMock } from '@kbn/usage-collection-plugin/server/mocks';

describe('Connectors Serverless Telemetry Usage Collector', () => {
  const makeUsageCollectorStub = jest.fn();
  const registerStub = jest.fn();
  const usageCollectionMock = {
    makeUsageCollector: makeUsageCollectorStub,
    registerCollector: registerStub,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerTelemetryUsageCollector', () => {
    it('should make and register the usage collector', () => {
      registerTelemetryUsageCollector(usageCollectionMock);

      expect(registerStub).toHaveBeenCalledTimes(1);
      expect(makeUsageCollectorStub).toHaveBeenCalledTimes(1);
      expect(makeUsageCollectorStub.mock.calls[0][0].type).toBe('connectors_serverless');
      expect(makeUsageCollectorStub.mock.calls[0][0].isReady()).toBe(true);
    });
  });

  describe('fetchTelemetryMetrics', () => {
    it('should return telemetry data', async () => {
      const fetchContextMock = createCollectorFetchContextMock();
      fetchContextMock.esClient.count = jest.fn().mockImplementation((query: any) =>
        Promise.resolve({
          count: query.query.bool.filter[0].term.is_native ? 5 : 2,
        })
      );
      registerTelemetryUsageCollector(usageCollectionMock);
      const telemetryMetrics = await makeUsageCollectorStub.mock.calls[0][0].fetch(
        fetchContextMock
      );

      expect(telemetryMetrics).toEqual({
        native: {
          total: 5,
        },
        clients: {
          total: 2,
        },
      });
    });
  });
});
