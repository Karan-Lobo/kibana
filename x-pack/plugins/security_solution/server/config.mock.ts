/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { DEFAULT_SIGNALS_INDEX, SIGNALS_INDEX_KEY } from '../common/constants';
import type { ExperimentalFeatures } from '../common/experimental_features';
import { parseExperimentalConfigValue } from '../common/experimental_features';
import { getDefaultConfigSettings } from '../common/config_settings';
import type { ConfigType } from './config';

export const createMockConfig = (): ConfigType => {
  const enableExperimental: Array<keyof ExperimentalFeatures> = ['responseActionUploadEnabled'];

  return {
    [SIGNALS_INDEX_KEY]: DEFAULT_SIGNALS_INDEX,
    maxRuleImportExportSize: 10000,
    maxRuleImportPayloadBytes: 10485760,
    maxTimelineImportExportSize: 10000,
    maxTimelineImportPayloadBytes: 10485760,
    enableExperimental,
    packagerTaskInterval: '60s',
    packagerTaskPackagePolicyUpdateBatchSize: 10,
    prebuiltRulesPackageVersion: '',
    alertMergeStrategy: 'missingFields',
    alertIgnoreFields: [],
    maxUploadResponseActionFileBytes: 26214400,
    settings: getDefaultConfigSettings(),
    experimentalFeatures: parseExperimentalConfigValue(enableExperimental).features,
    enabled: true,
    enableUiSettingsValidations: false,
  };
};

const withExperimentalFeature = (
  config: ConfigType,
  feature: keyof ExperimentalFeatures
): ConfigType => {
  const enableExperimental = config.enableExperimental.concat(feature);
  return {
    ...config,
    enableExperimental,
    experimentalFeatures: parseExperimentalConfigValue(enableExperimental).features,
  };
};

export const configMock = {
  createDefault: createMockConfig,
  withExperimentalFeature,
};
