// @flow

import React, { useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { push } from 'react-router-redux'
import { listTokens } from '@ledgerhq/live-common/lib/currencies'
import type { ApplicationVersion } from '@ledgerhq/live-common/lib/types/manager'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'

const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 5,
})`
  color: ${p => p.theme.colors.dark};
`

const Wrapper = styled(Box).attrs({
  alignItems: 'center',
  pt: 5,
})``

type Props = {
  query: string,
  app: ?ApplicationVersion,
  installApp: ApplicationVersion => *,
  push: typeof push,
}
const tokens = listTokens()

const NoItemPlaceholder = ({ query, installApp, app, push }: Props) => {
  const found = useMemo(
    () =>
      tokens.find(
        token =>
          token.name.toLocaleLowerCase().includes(query.toLowerCase()) ||
          token.ticker.toLocaleLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  const install = useCallback(() => {
    if (!app) return

    installApp(app)()
  }, [app, installApp])

  return found && app ? (
    <Wrapper>
      <Title>
        <Trans
          i18nKey="manager.apps.noAppNeededForToken"
          values={{ appName: app.name, tokenName: `${found.name} (${found.ticker})` }}
        />
      </Title>
      <Box pt={2} style={{ maxWidth: 500 }} alignItems="center">
        <Text
          ff="Open Sans|Regular"
          color="graphite"
          fontSize={4}
          textAlign="center"
          style={{ lineHeight: 1.6 }}
        >
          <Trans
            i18nKey="manager.apps.tokenAppDisclaimer"
            values={{
              appName: app.name,
              tokenName: found.name,
              tokenType: found.tokenType.toUpperCase(),
            }}
          >
            {'placeholder'}
            <Text ff="Open Sans|SemiBold" color="dark">
              {'placeholder'}
            </Text>
            {'placeholder'}
            <Text ff="Open Sans|SemiBold" color="dark">
              {'placeholder'}
            </Text>
          </Trans>
        </Text>
      </Box>
      <Box pt={5} horizontal>
        <Button
          outline
          outlineColor="grey"
          onClick={() => push('/accounts')}
          style={{ marginRight: 32 }}
        >
          <Trans i18nKey="manager.goToAccounts" />
        </Button>
        <Button primary onClick={install}>
          <Trans i18nKey="manager.intallEthApp" />
        </Button>
      </Box>
    </Wrapper>
  ) : null
}

export default connect(
  null,
  { push },
)(NoItemPlaceholder)
