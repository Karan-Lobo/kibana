/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { HttpStart } from '@kbn/core/public';
import { decodeOrThrow } from '@kbn/io-ts-utils';
import { find, merge } from 'lodash';
import {
  getDataStreamsMalformedDocsStatsResponseRt,
  getDataStreamsStatsResponseRt,
} from '../../../common/api_types';
import {
  DataStreamStatServiceResponse,
  GetDataStreamsMalformedDocsStatsQuery,
  GetDataStreamsMalformedDocsStatsResponse,
  GetDataStreamsStatsError,
  GetDataStreamsStatsQuery,
  GetDataStreamsStatsResponse,
} from '../../../common/data_streams_stats';
import { DataStreamStat } from '../../../common/data_streams_stats/data_stream_stat';
import { IDataStreamsStatsClient } from './types';

export class DataStreamsStatsClient implements IDataStreamsStatsClient {
  constructor(private readonly http: HttpStart) {}

  public async getDataStreamsStats(
    params: GetDataStreamsStatsQuery = { type: 'logs' }
  ): Promise<DataStreamStatServiceResponse> {
    const response = await this.http
      .get<GetDataStreamsStatsResponse>('/internal/dataset_quality/data_streams/stats', {
        query: params,
      })
      .catch((error) => {
        throw new GetDataStreamsStatsError(`Failed to fetch data streams stats": ${error}`);
      });

    const { dataStreamsStats, integrations } = decodeOrThrow(
      getDataStreamsStatsResponseRt,
      (message: string) =>
        new GetDataStreamsStatsError(`Failed to decode data streams stats response: ${message}"`)
    )(response);

    const mergedDataStreamsStats = dataStreamsStats.map((statsItem) => {
      const integration = find(integrations, { name: statsItem.integration });

      return merge({}, statsItem, { integration });
    });

    return mergedDataStreamsStats.map(DataStreamStat.create);
  }

  public async getDataStreamsMalformedStats(params: GetDataStreamsMalformedDocsStatsQuery) {
    const response = await this.http
      .get<GetDataStreamsMalformedDocsStatsResponse>(
        '/internal/dataset_quality/data_streams/malformed_docs',
        {
          query: {
            ...params,
            type: 'logs',
          },
        }
      )
      .catch((error) => {
        throw new GetDataStreamsStatsError(
          `Failed to fetch data streams malformed stats": ${error}`
        );
      });

    const { malformedDocs } = decodeOrThrow(
      getDataStreamsMalformedDocsStatsResponseRt,
      (message: string) =>
        new GetDataStreamsStatsError(
          `Failed to decode data streams malformed docs stats response: ${message}"`
        )
    )(response);

    return malformedDocs;
  }
}
