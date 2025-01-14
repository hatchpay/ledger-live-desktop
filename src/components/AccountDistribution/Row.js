// @flow

import React, { Fragment, PureComponent } from 'react'
import { getCurrencyColor } from '@ledgerhq/live-common/lib/currencies'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import type { CryptoCurrency, TokenCurrency } from '@ledgerhq/live-common/lib/types/currencies'
import { BigNumber } from 'bignumber.js'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { push } from 'react-router-redux'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import Ellipsis from 'components/base/Ellipsis'
import ParentCryptoCurrencyIcon from 'components/ParentCryptoCurrencyIcon'
import Box from 'components/base/Box'
import AccountContextMenu from 'components/ContextMenu/AccountContextMenu'
import { createStructuredSelector } from 'reselect'
import { accountsSelector } from 'reducers/accounts'
import IconDots from 'icons/Dots'
import Bar from './Bar'

export type AccountDistributionItem = {
  account: Account | TokenAccount,
  distribution: number, // % of the total (normalized in 0-1)
  amount: BigNumber,
  currency: CryptoCurrency | TokenCurrency,
  countervalue: BigNumber, // countervalue of the amount that was calculated based of the rate provided
}

type Props = {
  item: AccountDistributionItem,
  push: typeof push,
  accounts: Account[],
}

type State = {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;

  > * {
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
  }

  &:hover {
    background: ${p => p.theme.colors.lightGrey};
  }
`

const AccountWrapper = styled.div`
  width: 25%;
  > :first-child {
    margin-right: 10px;
  }
  > :nth-child(2) {
    margin-right: 8px;
  }
`
const Distribution = styled.div`
  width: 25%;
  text-align: right;
  > :first-child {
    margin-right: 11px;
    width: 40px; //max width for a 99.99% case
    text-align: right;
  }
`
const Amount = styled.div`
  width: 25%;
  text-align: right;
`
const Value = styled.div`
  width: 20%;
  box-sizing: border-box;
  padding-left: 8px;
  text-align: right;
`
const Dots = styled.div`
  width: 5%;
  justify-content: flex-end;
  cursor: pointer;
  color: ${p => p.theme.colors.fog};
  &:hover {
    color: ${p => p.theme.colors.grey};
  }
`

const mapDispatchToProps = {
  push,
}

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
})

class Row extends PureComponent<Props, State> {
  onAccountClick = (account: Account | TokenAccount) =>
    account.type !== 'Account'
      ? this.props.push(`/account/${account.parentId}/${account.id}`)
      : this.props.push(`/account/${account.id}`)

  render() {
    const {
      item: { currency, amount, distribution, account },
      accounts,
    } = this.props

    const parentAccount =
      account.type === 'TokenAccount' ? accounts.find(a => a.id === account.parentId) : null
    const color = getCurrencyColor(currency)
    const percentage = (Math.floor(distribution * 10000) / 100).toFixed(2)
    const icon = <ParentCryptoCurrencyIcon currency={currency} size={16} />
    const displayName = account.type === 'TokenAccount' ? currency.name : account.name

    return (
      <AccountContextMenu account={account} parentAccount={parentAccount} withStar>
        <Wrapper onClick={() => this.onAccountClick(account)}>
          <AccountWrapper>
            {icon}
            <Box grow>
              {parentAccount ? (
                <Box fontSize={10} color="graphite">
                  <Text ff="Open Sans|SemiBold">{parentAccount.name}</Text>
                </Box>
              ) : null}
              <Ellipsis ff="Open Sans|SemiBold" color="dark" fontSize={3}>
                {displayName}
              </Ellipsis>
            </Box>
          </AccountWrapper>
          <Distribution>
            {!!distribution && (
              <Fragment>
                <Text ff="Rubik" color="dark" fontSize={3}>
                  {`${percentage}%`}
                </Text>
                <Bar progress={percentage} progressColor={color} />
              </Fragment>
            )}
          </Distribution>
          <Amount>
            <Ellipsis>
              <FormattedVal
                color={'graphite'}
                unit={currency.units[0]}
                val={amount}
                fontSize={3}
                showCode
              />
            </Ellipsis>
          </Amount>
          <Value>
            <Ellipsis>
              {distribution ? (
                <CounterValue
                  currency={currency}
                  value={amount}
                  disableRounding
                  color="dark"
                  fontSize={3}
                  showCode
                  alwaysShowSign={false}
                />
              ) : (
                <Text ff="Rubik" color="dark" fontSize={3}>
                  {'-'}
                </Text>
              )}
            </Ellipsis>
          </Value>
          <Dots>
            <AccountContextMenu leftClick account={account} parentAccount={parentAccount} withStar>
              <IconDots size={16} />
            </AccountContextMenu>
          </Dots>
        </Wrapper>
      </AccountContextMenu>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Row)
