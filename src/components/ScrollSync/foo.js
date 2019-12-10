/** @flow */
import * as React from 'react';
import scrollbarSize from 'dom-helpers/scrollbarSize';
import clsx from 'clsx';
import {
  Grid,
  AutoSizer,
  ScrollSync,
  defaultCellRangeRenderer
} from 'react-virtualized';
import styles from './ScrollSync.example.css';

export default class GridExample extends React.PureComponent {
  render() {
    const COLUM_WIDTH = 75;
    const COLUM_COUNT = 50;
    const HEIGHT = 300;
    const OVER_SCAN_COLUMN_COUNT = 0;
    const OVER_SCAN_ROW_COUNT = 5;
    const ROW_HEIGHT = 100;
    const ROW_COUNT = 100;

    return (
      <ScrollSync>
        {({
          // clientHeight,
          clientWidth,
          onScroll,
          scrollHeight,
          scrollLeft,
          scrollTop,
          scrollWidth
        }) => {
          const topColor = '#ffffff';

          return (
            <div className={styles.GridRow}>
              <div
                className={styles.LeftSideGridContainer}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 999
                }}
              >
                <Grid
                  cellRenderer={this._renderHeaderCell}
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
                  top: ROW_HEIGHT
                }}
              >
                <Grid
                  overscanColumnCount={OVER_SCAN_COLUMN_COUNT}
                  overscanRowCount={OVER_SCAN_ROW_COUNT}
                  cellRenderer={this._renderSideCell}
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
                          cellRenderer={this._renderSideCell}
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

  _renderHeaderCell = ({ columnIndex, key, style }) => {
    return (
      <div key={key} style={style}>
        {`C${columnIndex}`}
      </div>
    );
  };

  _renderSideCell = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <div key={key} style={style}>
        {`R${rowIndex}, C${columnIndex}`}
      </div>
    );
  };
}
