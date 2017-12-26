# Simple form validation / submission jQuery plugin

## Demo

[SSD Form Demo](http://ssd-form.ssdtutorials.com/)

## Installation

```
npm i ssd-form
```

## Set up

```html
<div data-form-wrapper>

    <form
        method="post"
        action="./submit.php"
        data-ajax-form
        data-success-behaviour="fadeOutShowMessage"
        novalidate
    >

        <label for="title">
            <span data-validation="title">
                <span data-case="required">Please select your title</span>
                <span data-case="value_is">Selected value must be Mr</span>
            </span>
        </label>

        <select
            name="title"
            id="title"
            data-validate="required|value_is:1"
            >
            <option value="">Select title</option>
            <option value="1">Mr</option>
            <option value="2">Mrs</option>
            <option value="3">Miss</option>
            <option value="4">Ms</option>
        </select>

        <label for="first_name">
            <span data-validation="first_name">
                <span data-case="required">Please provide your first name</span>
                <span data-case="min">Length must be at least 3 characters</span>
                <span data-case="response">Validation triggered by ajax response</span>
            </span>
        </label>

        <input
            type="text"
            name="first_name"
            id="first_name"
            data-validate="required|min:3"
            placeholder="Your first name *"
        >

        <label for="last_name">
            <span data-validation="last_name">
                <span data-case="required">Please provide your last name</span>
                <span data-case="min">Length must be at least 3 characters</span>
            </span>
        </label>

        <input
            type="text"
            name="last_name"
            id="last_name"
            data-validate="required|min:3"
            placeholder="Your last name *"
        >

        <label for="email">
            <span data-validation="email">
                <span data-case="required">Please provide your email address</span>
                <span data-case="email">Invalid email address</span>
            </span>
        </label>

        <input
            type="email"
            name="email"
            id="email"
            data-validate="required|email"
            placeholder="Your email address *"
        >

        <label for="password">
            <span data-validation="password">
                <span data-case="required">Please choose your password</span>
                <span data-case="password">Length must be at least 6 characters, one capital letter and one number</span>
                <span data-case="confirmed">Passwords do not match</span>
            </span>
        </label>

        <input
            type="password"
            name="password"
            id="password"
            data-validate="required|password|confirmed"
            placeholder="Password"
        >

        <label for="password_confirmation">
            <span data-validation="password_confirmation">
                <span data-case="required">Please confirm your password</span>
                <span data-case="min">Length must be at least 5 characters</span>
            </span>
        </label>

        <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            data-validate="required|password"
            placeholder="Password"
        >
        
        <label>
            Please select delivery option
            <span data-validation="delivery">
                <span data-case="radio">You must select one option</span>
            </span>
        </label>

        <label for="delivery-1">
            <input type="radio" name="delivery" id="delivery-1" value="1" data-validate="radio"> Option 1
        </label>
        <label for="delivery-2">
            <input type="radio" name="delivery" id="delivery-2" value="2"> Option 2
        </label>
        <label for="delivery-3">
            <input type="radio" name="delivery" id="delivery-3" value="3"> Option 3
        </label>

        <label>
            <span data-validation="terms">
                <span data-case="checked">You must agree to our newsletter and conditions</span>
            </span>
        </label>
        
        
        <label>
            At least one option must be selected
            <span data-validation="category">
                <span data-case="min">You must select at least one option</span>
            </span>
        </label>

        <label for="category-1">
            <input type="checkbox" name="category[]" id="category-1" value="1" data-validate="min:1"> Option 1
        </label>
        <label for="category-2">
            <input type="checkbox" name="category[]" id="category-2" value="2"> Option 2
        </label>
        <label for="category-3">
            <input type="checkbox" name="category[]" id="category-3" value="3"> Option 3
        </label>
        

        <label>
            Exactly one option must be selected
            <span data-validation="type">
                <span data-case="min">You must select exactly one option</span>
                <span data-case="max">You must select exactly one option</span>
            </span>
        </label>

        <label for="type-1">
            <input type="checkbox" name="type[]" id="type-1" value="1" data-validate="min:1|max:1"> Option 1
        </label>
        <label for="type-2">
            <input type="checkbox" name="type[]" id="type-2" value="2"> Option 2
        </label>
        <label for="type-3">
            <input type="checkbox" name="type[]" id="type-3" value="3"> Option 3
        </label>
        

        <label for="terms">
            <input
                type="checkbox"
                name="terms"
                id="terms"
                data-validate="checked"
            > I agree to the terms and conditions
        </label>

        <input
            type="submit"
            class="button"
            value="SEND ENQUIRY"
            data-submit-trigger
        >

        <button
            type="button"
            class="button hide"
            disabled
            data-submit-pending
        >
            <i class="fa fa-spinner fa-spin"></i> PROCESSING
        </button>

    </form>

    <p data-confirmation></p>

</div>
```

Include the necessary styles for the plugin to work

```html
<link href="assets/css/ssd-form.css" rel="stylesheet">
```

To instantiate the form simply call it on the form

```javascript
$(function() {
    $('form[data-ajax-form]').ssdForm();
});
```

## Options

There are several options available

```
// form wrapper
dataFormWrapper: 'data-form-wrapper',

// confirmation element (if form behaviour shows confirmation)
dataConfirmation: 'data-confirmation',

// validation segment (wraps validation cases)
dataValidationSegment: 'data-validation',

// validation case (wraps each validation message for a given form element)
dataValidationCase: 'data-case',

// submit button
dataSubmitTrigger: 'data-submit-trigger',

// button that is shown when the form is being submitted (pending)
dataSubmitPending: 'data-submit-pending',

// class indicating that the given input's value
// is to be fetched from CKEDITOR.instances
classCkEditor: 'editor',

// class that hides pending button
classHide: 'hide',

// class that shows validation case
classShow: 'show',

// allows you to add more behaviours
extendBehaviours: {},

// allows you to add more validation rules
extendValidationRules: {}

// allows you to run custom behaviour on successful ajax response
postAjaxSuccess: function(form, form_model, data) {}

// allows you to run custom behaviour on failed ajax response
postAjaxFailure: function(form, form_model, jqXHR, textStatus, errorThrown) {}

// allows you to specify which attributes should be used
// during data serialization instead of default 'name' attribute
// example would be for instance 'data-field'
serializeAttribute: null,

// action that overwrites default behaviour
// of the validated form submission
// default one submits form using $.ajax()
// and form 'method' and 'action' attributes
actionMethod: function(form, form_model, success, error) {}
```

## Validation

To apply validation to a given element, apply `data-validate` attribute to it with the validation type. i.e.

```
data-validate="required|min:3"
```

### Validation options

- `required` : input must have a value
- `checked` : input must be checked
- `radio` : input of type `radio` must have one option selected
- `value_is:n` : input value must equal `n` (`value:10` would mean that value must equal 10)
- `email` : input value must be a valid email address - regex /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+([.\-]?[a-zA-Z0-9]+)?([\.]{1}[a-zA-Z]{2,4}){1,4}$/
- `password` : input value must match the following regex `/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/`
- `min:n` : input value's length must be minimum of `n` characters (or for array types - number of items in array). i.e. `min:10` would mean that the value has to be at least 10 characters long / array has to have at least 10 items
- `max:n` : input value's length must be maximum of `n` characters (or for array types - number of items in array). i.e. `max:10` would mean that the value has to be maximum 10 characters long / array must not have more than 10 items
- `confirmed` : input must have a matching input with the same name and `_confirmation` appended and both have to have the same value i.e `password`  and `password_confirmation`
- `regex` : input must match the regex associated with `data-regex`

## Form submission

Form will submit the input to the uri associated with its `action` attribute.
If response is to return any errors it should return them as json in the following format:

```json
{
    "first_name": "required",
    "email": "invalid"
}
```

Response keys represent the field (associated with `data-validation`) and value (or array of values) representing given case (associated with `data-case`).

Please note that if returned validation field contains array of cases, then only the first one will be displayed above the field.

For the validation to work, the response needs to return status code that would trigger `error` callback of the $.ajax() method - for instance `422` (please see example in submit.php).

## Successful behaviour

Once the form has been processed successfully it will trigger one of the following methods, associated with the `data-success-behaviour` attribute:

- `redirect` : redirects to a given url/i. Response needs to contain `redirect` entry `{ "redirect" : "/confirmation" }`
- `reload` : reloads the page
- `fadeOutShowMessage` : fades out the form and displays the message in its place. Response has to contain `message` entry `{ "message" : "Your request has been processed successfully." }`
- `fadeOutShowMessageRedirect` : fades out the form, displays the message and after 3 seconds redirects to a given url/i. Response needs to contain `message` and `redirect` entry `{ "message" : "Your request has been processed successfully.", "redirect" : "/confirmation" }`
- `fadeOutShowMessageReload` : fades out the form, displays the message and after 3 seconds reloads the page. Response needs to contain `message` entry { "message" : "Your request has been processed successfully." }`
- `fadeOutShowMessageResetFadeIn` : fades out the form, displays the message, resets the form and fades it back in. Response needs to contain `message` entry `{ "message" : "Your request has been processed successfully." }`
- `callReplaceRemove` : makes ajax call and replaces and removes elements specified in the response.

## Extending validation rules and form behaviours

If you'd like to add more validation rules, use the `extendValidationRules` option, which will extend the internal `ValidationRules` object. Each new method takes the `element` argument. `element.rules_collection` represents any value that's after the rules colon i.e. `min:5` would return `5`, `something:5,6,7` would return `5,6,7`:

```javascript
$('form[data-ajax-form]').ssdForm({

    extendValidationRules: {

        number_is: function(element) {

            return Number(element.value) === Number(element.rules_collection);

        }

    }

});

<input
    type="text"
    name="year"
    id="year"
    data-validate="required|number_is:2016"
    placeholder="Provide current year"
>
```

Other options available on the `element` object:

```
// name attribute
name,

// type attribute
type,

// value of the input
value,

// validation rules associated with the data-validate attribute
rules: obj.data('validate'),

// returns true if element name is of the array type
// i.e. name="category[]"
isArray,

// returns true if checkbox / radio button is checked
isChecked,

// returns true if given input is visible / not hidden
isVisible,

// returns true if given input has class 'editor' associated with it
// this option is useful if you're using wysiwyg editor etc.
isEditor,

// returns associated regex rule
regex
```

For behaviours you do the same with `extendBehaviours` option, methods which take two arguments `form` (instance of the `FormModel` object) and `data` (ajax json response):

```javascript
$('form[data-ajax-form]').ssdForm({

    extendBehaviours: {

        alertMessage: function(form, data) {

            alert(data.message);

        }

    }

});

<form
    method="post"
    action="./submit.php"
    data-ajax-form
    data-success-behaviour="alertMessage"
    novalidate
>
...
</form>
```

## Custom serialize attribute

There might be some situations where you might want to use different attribute on your form fields to represent the identity of your input than the default `name`.

This might be useful in situations where you might be sending request to the external service over the ssl and don't want your server to receive any data when the form is submitted.

You can specify what field attribute should be used by overwriting the `serializeAttribute` property.

```html
$('form[data-ajax-form]').ssdForm({

    serializeAttribute: 'data-field'

});

<input
    type="text"
    data-field="year"
    id="year"
    data-validate="required|number_is:2016"
    placeholder="Provide current year"
>
```

## Custom action

If you'd like to perform custom action once the form has been successfully validated, you can overwrite the default one by using the `actionMethod` property. This property is of a function type and takes 4 arguments.

- `form`: instance of the main Form object
- `form_model`: instance of the FormModel
- `success`: default success callback
- `error`: default error callback

```javascript
$('form[data-ajax-form]').ssdForm({

    actionMethod: function(form, form_model, success, error) {

        console.log('Calling action method');

        form.endRequest(form_model);

    }

});
```

## CKEDITOR field

To fetch data from the CKEDITOR instance, please use the `classCkEditor` config option to specify what css class is representing input associated with te CKEDITOR instance. Input also has to have associated `id` attribute. You will have to bind CKEDITOR instance with the input yourself, but form will fetch the correct data on submit.

```html
$('form[data-ajax-form]').ssdForm({

    classCkEditor: 'ckeditor'

});

<textarea class="ckeditor" id="body" name="body"></textarea>
```