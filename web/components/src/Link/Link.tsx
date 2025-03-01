/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { forwardRef, AnchorHTMLAttributes } from 'react'
import { Icon, Typography } from '@equinor/eds-core-react'
import { arrow_forward, external_link, arrow_down } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'
import { outlineTemplate, Tokens } from '@utils'
import type { LinkType } from '../../../types/types'

const { outline } = Tokens

// TODO: Get colours and other constants from theme with css variables

// Fetch the eds border colour. Hot or not?
const {
  colors: {
    interactive: {
      secondary__resting: { hsla: edsBorderColor },
    },
  },
} = tokens

export const BaseLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: var(--slate-blue-95);
  &[data-focus-visible-added]:focus {
    ${outlineTemplate(outline)}
  }
  & > svg {
    flex-shrink: 0;
    box-sizing: content-box;
    padding: 0 var(--space-1);
  }
  /* If the link is used inside a inverted component, the text colour must also be inverted */
  .inverted-background & {
    color: var(--mist-blue-100);
  }
`

// TODO: should part of this styling be moved to a list item instead?
const ContentLink = styled(BaseLink)`
  border-bottom: 0.5px solid var(--grey-40);
  text-decoration: none;
  padding: var(--space-small) 0;
  color: var(--slate-blue-100) !important;
  width: 100%;
  & > svg {
    fill: var(--energy-red-100);
    margin-left: auto;
    border: 1px solid transparent;
    border-radius: 50%;
    padding: var(--space-small) !important;
  }
  &:hover svg {
    background: var(--energy-red-50);
  }
  .inverted-background & {
    color: var(--inverted-text) !important;
  }
`

const ReadMoreLink = styled(BaseLink)`
  display: inline-flex;
  max-width: max-content;
  color: var(--slate-blue-100);
  justify-content: center;
  text-decoration: none;
  position: relative;

  & > svg {
    margin-left: var(--space-small);
    padding-right: 0;
    transition: 0.3s;
    fill: var(--energy-red-100);
  }

  &:hover svg {
    padding-left: var(--space-medium);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 0%;
    border-bottom: solid 0.5px var(--slate-blue-100);
    transition: 0.3s;
  }

  &:hover:after {
    width: 100%;
  }

  /* If the link is used inside a inverted component, the text colour must also be inverted */
  .inverted-background & {
    color: var(--inverted-text);
    &:after {
      border-bottom-color: var(--white-100);
    }
  }
`

const ButtonLink = styled(Typography)`
  color: var(--slate-blue-95);
  text-decoration: none;
  padding: var(--space-xSmall) var(--space-medium);
  display: inline-block;
  /*  @TODO: Do we want to use eds tokens? */
  border: 1px solid ${edsBorderColor};
  border-radius: ${tokens.shape.button.borderRadius};

  /* If the button link is used inside a inverted component, the text colour must also be inverted */
  &:hover {
    color: var(--inverted-text);
    background-color: var(--slate-blue-100);
  }
  .inverted-background & {
    color: var(--inverted-text);
    border-color: var(--white-100);
    &:hover {
      background-color: var(--white-100);
      color: var(--slate-blue-100);
    }
  }
`

const getIconData = (type: LinkType) => {
  switch (type) {
    case 'downloadableFile':
    case 'downloadableImage': {
      return arrow_down
    }
    case 'externalUrl': {
      return external_link
    }
    default:
      return arrow_forward
  }
}

export type LinkProps = {
  /** Which design to use */
  variant?: 'regular' | 'contentLink' | 'readMore' | 'buttonLink'
  /** What kind of content is it  */
  type?: LinkType
} & AnchorHTMLAttributes<HTMLAnchorElement>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { children, variant = 'regular', type = 'internalUrl', ...rest },
  ref,
) {
  if (variant === 'contentLink') {
    return (
      <ContentLink ref={ref} {...rest}>
        {children} <Icon data={getIconData(type)} />
      </ContentLink>
    )
  } else if (variant === 'readMore') {
    return (
      <ReadMoreLink ref={ref} {...rest}>
        {children} <Icon data={getIconData(type)} />
      </ReadMoreLink>
    )
  } else if (variant === 'buttonLink') {
    return (
      <ButtonLink link ref={ref} {...rest}>
        {children}
      </ButtonLink>
    )
  }

  // TODO: design not final
  return (
    <BaseLink ref={ref} {...rest}>
      {children} {type === 'externalUrl' ? <Icon data={external_link} size={16} /> : null}
    </BaseLink>
  )
})
