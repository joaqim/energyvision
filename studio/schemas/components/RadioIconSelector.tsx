/* eslint-disable import/no-unresolved */
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event'
import FormField from 'part:@sanity/components/formfields/default'
import { Box, Inline } from '@sanity/ui'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

type StyledBoxProps = {
  children: React.ReactNode
}

const StyledBox = ({ children }: StyledBoxProps) => (
  <Box padding={[2, 2, 3, 3]} display="flex" style={{ outline: '1px solid #cad1dc', cursor: 'pointer' }}>
    {children}
  </Box>
)

const StyledRadio = styled.input`
  opacity: 0;
  position: absolute;

  &:focus + label {
    outline: #2276fc auto 1px;
    border-radius: 0;
  }

  &:checked + label div {
    background-color: rgba(34, 118, 252, 0.15);
  }
`

type RadioIconSelectorOption = {
  value: string
  icon: () => JSX.Element
}

type RadioIconSelectorProps = {
  name: string
  options: RadioIconSelectorOption[]
  currentValue: string
  defaultValue: string
  type: { title: 'string'; description: string }
  onChange: any
}

export const RadioIconSelector = ({
  name,
  options,
  currentValue,
  defaultValue,
  type,
  onChange,
}: RadioIconSelectorProps) => {
  const [value, setValue] = useState(currentValue || defaultValue)

  const handleChange = useCallback((event) => {
    const newValue = event.currentTarget.value
    setValue(newValue)
    onChange(PatchEvent.from(set(newValue)))
  }, [])

  return (
    <FormField label={type.title} description={type.description}>
      <Inline space={3}>
        {options.map((option: RadioIconSelectorOption) => (
          <div key={`container_${option.value}`}>
            <StyledRadio
              type="radio"
              checked={value === option.value}
              onChange={handleChange}
              name={name}
              value={option.value}
              id={`id_${option.value.replace(/ /g, '')}`}
            />
            <label htmlFor={`id_${option.value.replace(/ /g, '')}`}>
              <StyledBox>{option.icon()}</StyledBox>
            </label>
          </div>
        ))}
      </Inline>
    </FormField>
  )
}
