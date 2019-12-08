/** @flow */
import * as React from 'react';
import scrollbarSize from 'dom-helpers/scrollbarSize';
import clsx from 'clsx';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import styles from './ScrollSync.example.css';

const LEFT_COLOR_FROM = hexToRgb('#471061');
const LEFT_COLOR_TO = hexToRgb('#BC3959');
const TOP_COLOR_FROM = hexToRgb('#000000');
const TOP_COLOR_TO = hexToRgb('#333333');

export default class GridExample extends React.PureComponent {
  render() {
    const COLUM_WIDTH = 75;
    const COLUM_COUNT = 50;
    const HEIGHT = 300;
    const OVER_SCAN_COLUMN_COUNT = 0;
    const OVER_SCAN_ROW_COUNT = 5;
    const ROW_HEIGHT = 40;
    const ROW_COUNT = 100;

    return (
      <ScrollSync>
        {({
          clientHeight,
          clientWidth,
          onScroll,
          scrollHeight,
          scrollLeft,
          scrollTop,
          scrollWidth
        }) => {
          const x = scrollLeft / (scrollWidth - clientWidth);
          const y = scrollTop / (scrollHeight - clientHeight);

          const leftBackgroundColor = mixColors(
            LEFT_COLOR_FROM,
            LEFT_COLOR_TO,
            y
          );
          const leftColor = '#ffffff';
          const topBackgroundColor = mixColors(TOP_COLOR_FROM, TOP_COLOR_TO, x);
          const topColor = '#ffffff';
          const middleBackgroundColor = mixColors(
            leftBackgroundColor,
            topBackgroundColor,
            0.5
          );
          const middleColor = '#ffffff';

          return (
            <div className={styles.GridRow}>
              <div
                className={styles.LeftSideGridContainer}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 99999,
                  color: leftColor,
                  backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`
                }}
              >
                <Grid
                  cellRenderer={this._renderLeftHeaderCell}
                  className={styles.HeaderGrid}
                  width={COLUM_WIDTH}
                  height={ROW_HEIGHT}
                  rowHeight={ROW_HEIGHT}
                  columnWidth={COLUM_WIDTH}
                  rowCount={1}
                  columnCount={1}
                />
              </div>
              <div
                className={styles.LeftSideGridContainer}
                style={{
                  position: 'absolute',
                  left: 0,
                  zIndex: 99999,
                  top: ROW_HEIGHT,
                  color: leftColor,
                  backgroundColor: `rgb(${leftBackgroundColor.r},${leftBackgroundColor.g},${leftBackgroundColor.b})`
                }}
              >
                <Grid
                  overscanColumnCount={OVER_SCAN_COLUMN_COUNT}
                  overscanRowCount={OVER_SCAN_ROW_COUNT}
                  cellRenderer={this._renderLeftSideCell}
                  columnWidth={COLUM_WIDTH}
                  columnCount={1}
                  className={styles.LeftSideGrid}
                  height={HEIGHT - scrollbarSize()}
                  rowHeight={ROW_HEIGHT}
                  rowCount={ROW_COUNT}
                  scrollTop={scrollTop}
                  width={COLUM_WIDTH}
                />
              </div>
              <div className={styles.GridColumn}>
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <div>
                      <div
                        style={{
                          backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`,
                          color: topColor,
                          height: ROW_HEIGHT,
                          width: width - scrollbarSize()
                        }}
                      >
                        <Grid
                          className={styles.HeaderGrid}
                          columnWidth={COLUM_WIDTH}
                          columnCount={COLUM_COUNT}
                          height={ROW_HEIGHT}
                          overscanColumnCount={OVER_SCAN_COLUMN_COUNT}
                          cellRenderer={this._renderHeaderCell}
                          rowHeight={ROW_HEIGHT}
                          rowCount={1}
                          scrollLeft={scrollLeft}
                          width={width - scrollbarSize()}
                        />
                      </div>
                      <div
                        style={{
                          backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                          color: middleColor,
                          height: HEIGHT,
                          width
                        }}
                      >
                        <Grid
                          className={styles.BodyGrid}
                          columnWidth={COLUM_WIDTH}
                          columnCount={COLUM_COUNT}
                          height={HEIGHT}
                          onScroll={onScroll}
                          overscanColumnCount={OVER_SCAN_COLUMN_COUNT}
                          overscanRowCount={OVER_SCAN_ROW_COUNT}
                          cellRenderer={this._renderBodyCell}
                          rowHeight={ROW_HEIGHT}
                          rowCount={ROW_COUNT}
                          width={width}
                        />
                      </div>
                    </div>
                  )}
                </AutoSizer>
              </div>
            </div>
          );
        }}
      </ScrollSync>
    );
  }

  _renderBodyCell = ({ columnIndex, key, rowIndex, style }) => {
    if (columnIndex < 1) {
      return;
    }

    return this._renderLeftSideCell({ columnIndex, key, rowIndex, style });
  };

  _renderHeaderCell = ({ columnIndex, key, rowIndex, style }) => {
    if (columnIndex < 1) {
      return;
    }

    return this._renderLeftHeaderCell({ columnIndex, key, rowIndex, style });
  };

  _renderLeftHeaderCell = ({ columnIndex, key, style }) => {
    return (
      <div className={styles.headerCell} key={key} style={style}>
        {`C${columnIndex}`}
      </div>
    );
  };

  _renderLeftSideCell = ({ columnIndex, key, rowIndex, style }) => {
    const rowClass =
      rowIndex % 2 === 0
        ? columnIndex % 2 === 0
          ? styles.evenRow
          : styles.oddRow
        : columnIndex % 2 !== 0
        ? styles.evenRow
        : styles.oddRow;
    const classNames = clsx(rowClass, styles.cell);

    return (
      <div className={classNames} key={key} style={style}>
        {`R${rowIndex}, C${columnIndex}`}
      </div>
    );
  };
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors(color1, color2, amount) {
  const weight1 = amount;
  const weight2 = 1 - amount;

  const r = Math.round(weight1 * color1.r + weight2 * color2.r);
  const g = Math.round(weight1 * color1.g + weight2 * color2.g);
  const b = Math.round(weight1 * color1.b + weight2 * color2.b);

  return { r, g, b };
}
