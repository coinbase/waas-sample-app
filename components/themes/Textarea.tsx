/**
 * Copyright 2023 Coinbase Global, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export const TextareaTheme = {
    'w': '100%',
    'borderWidth': 1,
    'borderColor': '$brandPrimaryLineHeavy',
    'borderRadius': '$sm',
    'h': 100,
    '_input': {
      p: '$3',
      _web: {
        outlineWidth: 0,
        outline: 'none',
      },
    },
    ':hover': {
      borderColor: '$brandPrimary',
    },

    ':focus': {
      'borderColor': '$brandPrimary',
      ':hover': {
        borderColor: '$brandPrimary',
      },
    },

    ':disabled': {
      'opacity': 0.4,
      ':hover': {
        borderColor: '$brandPrimaryLineHeavy',
      },
    },

    'variants': {
      size: {
        xl: {
          _input: {
            fontSize: '$xl',
          },
        },

        lg: {
          _input: {
            fontSize: '$lg',
          },
        },
        md: {
          _input: {
            fontSize: '$md',
          },
        },
        sm: {
          _input: {
            fontSize: '$sm',
          },
        },
      },
      variant: {
        default: {
          '_input': {
            _web: {
              outlineWidth: '0',
              outline: 'none',
            },
          },
          ':focus': {
            borderColor: '$brandPrimary',
          },
          ':invalid': {
            'borderColor': '$brandNegative',
            ':hover': {
              borderColor: '$brandNegative',
            },
            ':focus': {
              ':hover': {
                borderColor: '$brandNegative',
              },
            },
            ':disabled': {
              ':hover': {
                borderColor: '$brandNegative',
              },
            },
          },
        },
      },
    },

    'defaultProps': {
      variant: 'default',
      size: 'md',
    },
  };