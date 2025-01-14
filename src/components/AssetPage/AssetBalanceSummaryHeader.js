// @flow

import React, { PureComponent } from 'react'
import { BigNumber } from 'bignumber.js'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type {
  Currency,
  ValueChange,
  CryptoCurrency,
  TokenCurrency,
  Unit,
} from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import { setSelectedTimeRange, setCountervalueFirst } from 'actions/settings'
import type { TimeRange } from 'reducers/settings'

import { BalanceTotal, BalanceDiff } from 'components/BalanceInfos'
import Box, { Tabbable } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import Price from 'components/Price'
import PillsDaysCount from 'components/PillsDaysCount'
import styled from 'styled-components'
import Swap from '../../icons/Swap'

type Props = {
  isAvailable: boolean,
  cryptoChange: ValueChange,
  countervalueChange: ValueChange,
  last: {
    value: BigNumber,
    countervalue: BigNumber,
  },
  counterValue: Currency,
  t: T,
  setSelectedTimeRange: TimeRange => *,
  selectedTimeRange: TimeRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
  currency: CryptoCurrency | TokenCurrency,
  unit: Unit,
}

const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const SwapButton = styled(Tabbable).attrs({
  color: 'dark',
  ff: 'Museo Sans',
  fontSize: 7,
})`
  align-items: center;
  align-self: center;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.fog};
  color: ${p => p.theme.colors.fog};
  cursor: pointer;
  display: flex;
  height: 53px;
  justify-content: center;
  margin-right: 16px;
  width: 25px;

  &:hover {
    border-color: ${p => p.theme.colors.dark};
    color: ${p => p.theme.colors.dark};
  }

  &:active {
    opacity: 0.5;
  }
`

const mapDispatchToProps = {
  setSelectedTimeRange,
  setCountervalueFirst,
}

class AssetBalanceSummaryHeader extends PureComponent<Props> {
  handleChangeSelectedTime = item => {
    this.props.setSelectedTimeRange(item.key)
  }

  render() {
    const {
      t,
      counterValue,
      selectedTimeRange,
      isAvailable,
      last,
      cryptoChange,
      countervalueChange,
      countervalueFirst,
      setCountervalueFirst,
      currency,
      unit,
    } = this.props

    const cvUnit = counterValue.units[0]
    const data = [
      { valueChange: cryptoChange, balance: last.value, unit },
      { valueChange: countervalueChange, balance: last.countervalue, unit: cvUnit },
    ]
    if (countervalueFirst) {
      data.reverse()
    }

    const primaryKey = data[0].unit.code
    const secondaryKey = data[1].unit.code

    return (
      <Box flow={5}>
        <Box horizontal>
          {isAvailable && (
            <SwapButton onClick={() => setCountervalueFirst(!countervalueFirst)}>
              <Swap />
            </SwapButton>
          )}
          <BalanceTotal
            key={primaryKey}
            style={{
              cursor: isAvailable ? 'pointer' : '',
              overflow: 'hidden',
              flexShrink: 1,
            }}
            onClick={() => setCountervalueFirst(!countervalueFirst)}
            showCryptoEvenIfNotAvailable
            isAvailable={isAvailable}
            totalBalance={data[0].balance}
            unit={data[0].unit}
          >
            <Wrapper style={{ marginTop: 4 }}>
              <div style={{ width: 'auto', marginRight: 20 }}>
                <FormattedVal
                  key={secondaryKey}
                  animateTicker
                  disableRounding
                  alwaysShowSign={false}
                  color="warmGrey"
                  unit={data[1].unit}
                  fontSize={6}
                  showCode
                  val={data[1].balance}
                />
              </div>
              <Price
                unit={unit}
                from={currency}
                withActivityCurrencyColor
                withEquality
                color="warmGrey"
                fontSize={6}
                iconSize={16}
              />
            </Wrapper>
          </BalanceTotal>
        </Box>
        <Box
          key={primaryKey}
          horizontal
          alignItems="center"
          justifyContent={isAvailable ? 'space-between' : 'flex-end'}
          flow={7}
        >
          <BalanceDiff
            t={t}
            totalBalance={data[0].balance}
            valueChange={data[0].valueChange}
            unit={data[0].unit}
            since={selectedTimeRange}
            isAvailable={isAvailable}
          />
          <PillsDaysCount selected={selectedTimeRange} onChange={this.handleChangeSelectedTime} />
        </Box>
      </Box>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(), // FIXME t() is not even needed directly here. should be underlying component responsability to inject it
)(AssetBalanceSummaryHeader)
