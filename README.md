# @appbot/uncover

[![Maintainability](https://api.codeclimate.com/v1/badges/ab59d137b487363080eb/maintainability)](https://codeclimate.com/repos/6400001854e316009d001dd2/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/ab59d137b487363080eb/test_coverage)](https://codeclimate.com/repos/6400001854e316009d001dd2/test_coverage)

Several code quality tools can only handle line coverage, but that doesn't help when your production code is failing with missed branches, or uncovered methods.

This tool allow you to take your valid LCOV files, with the useful branch and function coverage, and modify the line coverage to reflect those misses.

```javascript
# javascript
if (something) {
  newThing = new Thing();
}
```

```ruby
# ruby
newThing = Thing.new if something
```

Testing each of these with `something` set will show positive line coverage, and checking coverage locally would likely show the missing (branch) coverage from where it was not set, but your online tool may not show that. For a PR with anything substantial going on, it's easy to miss a non-present test covering non-present code. Well, you won't any more. In fact, you may be triggered to look even harder, because now some code that seems obviously covered, will show no coverage at all.

```javascript
# javascript
const meth = () => 'call me'
```

```ruby
# ruby 3.1
def meth = 'call me'
```

These too would show positive line coverage, even when the method was never called. These are rectified by clearing the coverage for the line on which they were defined.

For Ruby: Note that you will need to use the [umbrellio fork with the method coverage branch](https://github.com/umbrellio/simplecov/tree/add-method-coverage-support) to get method coverage until [PR#987](https://github.com/simplecov-ruby/simplecov/pull/987) is merged.

As an example of the lies that line coverage provides. When we enabled this tool at [Appbot](https://appbot.co) or coverage on Code Climate dropped by about 4%. Now excuse me while I go squash some potential bugs 🐛.
