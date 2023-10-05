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
export const ButtonTheme = {
    borderRadius: '$sm',
    backgroundColor: '$brandPrimary',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '$14',
    _text: {
      color: '$brandPrimaryForeground',
    },

    _icon: {
      color: '$brandPrimaryForeground',
    },

    _spinner: {
      props: {
        color: '$brandPrimaryForeground',
      },
    },

    variants: {
      action: {
        primary: {
          bg: '$brandPrimary',
          borderColor: '$transparent',

          ':hover': {
            bg: '$brandPrimaryHover',
          },

          ':active': {
            bg: '$brandPrimaryPressed',
          },

          _text: {
            color: '$text',
            ':hover': {
              color: '$text',
            },
            ':active': {
              color: '$text',
            },
          },

          _icon: {
            color: '$text',
            ':hover': {
              color: '$text',
            },
            ':active': {
              color: '$text',
            },
          },

          _spinner: {
            props: {
              color: '$text',
            },
            ':hover': {
              props: {
                color: '$text',
              },
            },
            ':active': {
              props: {
                color: '$text',
              },
            },
          },
        },
        secondary: {
          bg: '$brandSecondary',
          borderColor: '$transparent',

          ':hover': {
            bg: '$brandSecondaryHover',
          },

          ':active': {
            bg: '$brandSecondaryPressed',
          },

          _text: {
            color: '$brandSecondaryForeground',
            ':hover': {
              color: '$brandSecondaryForeground',
            },
            ':active': {
              color: '$brandSecondaryForeground',
            },
          },
          _icon: {
            color: '$brandSecondaryForeground',
            ':hover': {
              color: '$brandSecondaryForeground',
            },
            ':active': {
              color: '$brandSecondaryForeground',
            },
          },

          _spinner: {
            props: {
              color: '$brandSecondaryForeground',
            },
            ':hover': {
              props: { color: '$brandSecondaryForeground' },
            },
            ':active': {
              props: { color: '$brandSecondaryForeground' },
            },
          },
        },
        default: {
          bg: '$transparent',
          ':hover': {
            bg: '$brandDefaultHover',
          },
          ':active': {
            bg: '$brandDefaultPressed',
          },
        },
      },
      variant: {
        outline: {
          bg: '$brandPrimaryForeground',
          borderWidth: '$1',
          ':hover': {
            bg: '$brandPrimaryForeground',
          },
          ':active': {
            bg: '$brandPrimaryForeground',
          },
        },
      },

      size: {
        xs: {
          px: '$3.5',
          h: '$8',
          _icon: {
            h: '$3',
            w: '$3',
          },
          _text: {
            fontSize: '$xs',
            lineHeight: '$sm',
          },
        },
        sm: {
          px: '$4',
          h: '$9',
          _icon: {
            h: '$4',
            w: '$4',
          },
          _text: {
            fontSize: '$sm',
            lineHeight: '$sm',
          },
        },
        md: {
          px: '$5',
          h: '$10',
          _icon: {
            h: '$4.5',
            w: '$4.5',
          },
          _text: {
            fontSize: '$md',
            lineHeight: '$md',
          },
        },
        lg: {
          px: '$6',
          h: '$11',
          _icon: {
            h: '$4.5',
            w: '$4.5',
          },
          _text: {
            fontSize: '$lg',
            lineHeight: '$xl',
          },
        },
        xl: {
          px: '$7',
          h: '$12',
          _icon: {
            h: '$5',
            w: '$5',
          },
          _text: {
            fontSize: '$xl',
            lineHeight: '$xl',
          },
        },
      },
    },
    compoundVariants: [
      {
        action: 'primary',
        variant: 'outline',
        value: {
            bg: '$brandSecondaryForeground',
            borderColor: '$transparent',
  
            ':hover': {
              bg: '$brandSecondaryForeground',
            },
  
            ':active': {
              bg: '$brandSecondaryForeground',
            },
  
            _text: {
              color: '$brandPrimaryForeground',
              ':hover': {
                color: '$brandPrimaryForeground',
              },
              ':active': {
                color: '$brandPrimaryForeground',
              },
            },
  
            _icon: {
              color: '$brandPrimaryForeground',
              ':hover': {
                color: '$brandPrimaryForeground',
              },
              ':active': {
                color: '$brandPrimaryForeground',
              },
            },
  
            _spinner: {
              props: {
                color: '$brandPrimaryForeground',
              },
              ':hover': {
                props: {
                  color: '$brandPrimaryForeground',
                },
              },
              ':active': {
                props: {
                  color: '$brandPrimaryForeground',
                },
              },
            },
          },
      },
      {
        action: 'secondary',
        variant: 'outline',
        value: {
            bg: '$background',
            borderColor: '$brandSecondaryForeground',
  
            ':hover': {
              bg: '$brandPrimaryForeground',
            },
  
            ':active': {
              bg: '$brandPrimaryForeground',
            },
  
            _text: {
              color: '$brandSecondaryForeground',
              ':hover': {
                color: '$brandSecondaryForeground',
              },
              ':active': {
                color: '$brandSecondaryForeground',
              },
            },
  
            _icon: {
              color: '$brandSecondaryForeground',
              ':hover': {
                color: '$brandSecondaryForeground',
              },
              ':active': {
                color: '$brandSecondaryForeground',
              },
            },
  
            _spinner: {
              props: {
                color: '$brandSecondaryForeground',
              },
              ':hover': {
                props: {
                  color: '$brandSecondaryForeground',
                },
              },
              ':active': {
                props: {
                  color: '$brandSecondaryForeground',
                },
              },
            },
          },
      },
      {
        action: 'primary',
        variant: 'solid',
        value: {
            bg: '$brandPrimary',
            borderColor: '$transparent',
  
            ':hover': {
              bg: '$brandPrimaryHover',
            },
  
            ':active': {
              bg: '$brandPrimaryPressed',
            },
  
            _text: {
              color: '$yellow',
              ':hover': {
                color: '$yellow',
              },
              ':active': {
                color: '$yellow',
              },
            },
  
            _icon: {
              color: '$brandPrimaryForeground',
              ':hover': {
                color: '$brandPrimaryForeground',
              },
              ':active': {
                color: '$brandPrimaryForeground',
              },
            },
  
            _spinner: {
              props: {
                color: '$brandPrimaryForeground',
              },
              ':hover': {
                props: {
                  color: '$brandPrimaryForeground',
                },
              },
              ':active': {
                props: {
                  color: '$brandPrimaryForeground',
                },
              },
            },
          },
      },
      {
        action: 'secondary',
        variant: 'solid',
        value: {
            bg: '$brandSecondary',
            borderColor: '$transparent',
  
            ':hover': {
              bg: '$brandSecondaryHover',
            },
  
            ':active': {
              bg: '$brandSecondaryPressed',
            },
  
            _text: {
              color: '$brandSecondaryForeground',
              ':hover': {
                color: '$brandSecondaryForeground',
              },
              ':active': {
                color: '$brandSecondaryForeground',
              },
            },
  
            _icon: {
              color: '$brandSecondaryForeground',
              ':hover': {
                color: '$brandSecondaryForeground',
              },
              ':active': {
                color: '$brandSecondaryForeground',
              },
            },
  
            _spinner: {
              props: {
                color: '$brandSecondaryForeground',
              },
              ':hover': {
                props: {
                  color: '$brandSecondaryForeground',
                },
              },
              ':active': {
                props: {
                  color: '$brandSecondaryForeground',
                },
              },
            },
          },
      },
      {
        action: 'default',
        variant: 'solid',
        value: {
            bg: '$transparent',
            borderColor: '$transparent',
  
            ':hover': {
              bg: '$brandSecondaryForeground',
            },
  
            ':active': {
              bg: '$brandSecondaryForeground',
            },
  
            _text: {
              color: '$brandSecondaryForeground',
              ':hover': {
                color: '$brandPrimaryForeground',
              },
              ':active': {
                color: '$brandPrimaryForeground',
              },
            },
  
            _icon: {
              color: '$brandSecondaryForeground',
              ':hover': {
                color: '$brandPrimaryForeground',
              },
              ':active': {
                color: '$brandPrimaryForeground',
              },
            },
  
            _spinner: {
              props: {
                color: '$brandSecondaryForeground',
              },
              ':hover': {
                props: {
                  color: '$brandPrimaryForeground',
                },
              },
              ':active': {
                props: {
                  color: '$brandPrimaryForeground',
                },
              },
            },
          },
      },
    ],

    defaultProps: {
      size: 'md',
      variant: 'solid',
      action: 'primary',
    },

    ':disabled': {
      opacity: 0.5,
    },
  };