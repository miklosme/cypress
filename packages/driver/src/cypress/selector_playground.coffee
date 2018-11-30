_ = require("lodash")
uniqueSelector = require("@cypress/unique-selector").default

$utils = require("./utils")

SELECTOR_PRIORITIES = "data-cy data-test data-testid id class tag attributes nth-child".split(" ")

reset = -> {
  onElement: null
  selectorPriority: SELECTOR_PRIORITIES
}

defaults = reset()

module.exports = {
  reset: ->
    ## for testing purposes
    defaults = reset()

  getSelectorPriority: ->
    defaults.selectorPriority

  getOnElement: ->
    defaults.onElement

  getSelector: ($el) ->
    ## if we have a callback, and it returned truthy
    if defaults.onElement and (selector = defaults.onElement($el))
      ## and it returned a string
      if _.isString(selector)
        ## use this!
        return selector

    ## else use uniqueSelector with the priorities
    uniqueSelector($el.get(0), {
      selectorTypes: defaults.selectorPriority
    })

  getXPathSelector: ($el) ->
    results = []

    $current = $el
    while $current.length
      uiComponent = $current.data('ui')
      if _.isString(uiComponent)
        results.push(uiComponent)
      $current = $current.parent()

    results.reverse().map((name) -> "//*[@data-ui=\"#{name}\"]").join('')

  defaults: (props) ->
    if not _.isPlainObject(props)
      $utils.throwErrByPath("selector_playground.defaults_invalid_arg", {
        args: { arg: $utils.stringify(props) }
      })

    if priority = props.selectorPriority
      if not _.isArray(priority)
        $utils.throwErrByPath("selector_playground.defaults_invalid_priority", {
          args: { arg: $utils.stringify(priority) }
        })

      defaults.selectorPriority = priority

    if onElement = props.onElement
      if not _.isFunction(onElement)
        $utils.throwErrByPath("selector_playground.defaults_invalid_on_element", {
          args: { arg: $utils.stringify(onElement) }
        })

      defaults.onElement = onElement
}
