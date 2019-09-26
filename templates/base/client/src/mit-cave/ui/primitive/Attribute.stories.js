import { storiesOf } from '@storybook/react'
import React from 'react'
import { AttributeForm, BigForm, Pad } from '../compound'
import { primitive } from '../storyConsts'

import { Attribute, AttributeMulti } from './Attribute'
import { AttributeToggle } from './Toggle'

storiesOf(primitive('Attribute'), module)
  .add('Single - not yet done', () => (
    <Pad x={200} y={900} width={320} height={800}>
      <BigForm>
        <Attribute label="readOnly" value="field value" readOnly />
        <Attribute label="editable" value="field value" />
        <Attribute label="editable, changed" value="field value" changed/>
        <Attribute label="active" value="field value"  isActive/>
        <Attribute label="active, changed" value="field value"  isActive changed/>
        <AttributeToggle label="readOnly" value="field value" readOnly />
        <AttributeToggle label="editable" value="field value" />
        <AttributeToggle label="editable, changed" value="field value" changed/>
        {/*<AttributeToggle label="active" value="field value"  isActive/>*/}
        {/*<AttributeToggle label="active, changed" value="field value"  isActive changed/>*/}
      </BigForm>
    </Pad>
  ))
  .add('Multi', () => (
    <Pad x={200} y={400}>
      <AttributeForm>
        <AttributeMulti>
          <Attribute label="fieldname" value="field value" />
          <Attribute label="fieldname" value="field value" />
          <Attribute label="fieldname" value="field value" />
          <Attribute label="fieldname" value="field value" />
        </AttributeMulti>
        <AttributeMulti>
          <Attribute label="fieldname" value="field value" />
          <Attribute label="fieldname" value="field value" />
          <Attribute label="fieldname" value="field value" />
          <Attribute label="fieldname" value="field value" />
        </AttributeMulti>
      </AttributeForm>
    </Pad>
  ))
