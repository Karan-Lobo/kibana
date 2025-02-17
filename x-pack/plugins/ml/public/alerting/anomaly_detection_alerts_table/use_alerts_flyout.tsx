/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  AlertsTableFlyoutBaseProps,
  AlertTableFlyoutComponent,
} from '@kbn/triggers-actions-ui-plugin/public';
import { get } from 'lodash';
import React from 'react';
import { type EuiDataGridColumn, EuiDescriptionList, EuiPanel, EuiTitle } from '@elastic/eui';
import { ALERT_RULE_NAME } from '@kbn/rule-data-utils';
import { isDefined } from '@kbn/ml-is-defined';
import { RegisterFormatter } from './render_cell_value';

const FlyoutHeader: AlertTableFlyoutComponent = ({ alert }: AlertsTableFlyoutBaseProps) => {
  const name = alert[ALERT_RULE_NAME];
  return (
    <EuiTitle size="s">
      <h3>{name}</h3>
    </EuiTitle>
  );
};

export const getAlertFlyout =
  (columns: EuiDataGridColumn[], formatter: RegisterFormatter) => () => {
    const FlyoutBody: AlertTableFlyoutComponent = ({ alert, id }: AlertsTableFlyoutBaseProps) => (
      <EuiPanel>
        <EuiDescriptionList
          listItems={columns.map((column) => {
            const value = get(alert, column.id)?.[0];

            return {
              title: column.displayAsText as string,
              description: isDefined(value) ? formatter(column.id, value) : '—',
            };
          })}
          type="column"
          columnWidths={[1, 3]} // Same as [25, 75]
        />
      </EuiPanel>
    );

    return {
      body: FlyoutBody,
      header: FlyoutHeader,
      footer: null,
    };
  };
