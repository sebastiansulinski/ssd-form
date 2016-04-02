# Simple form validation / submission jQuery plugin

## Installation

```
npm i ssd-form
```

## Usage example

Form

```
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

        <label for="newsletter">
            <span data-validation="newsletter">
                <span data-case="checked">You must agree to our newsletter and conditions</span>
            </span>
        </label>


        <span data-validation="terms">
            <span data-case="checked">You must agree to our terms and conditions</span>
        </span>

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

To instantiate the form simply call it on the form

```
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

// class that hides pending button
classHide: 'hide',

// class that shows validation case
classShow: 'show'
```

## Validation

To apply validation to a given element, apply `data-validate` attribute to it with the validation type. i.e.

```
data-validate="required|min:3"
```

### Validation options

- `required` : input must have a value
- `checked` : input must be checked
- `value_is:n` : input value must equal `n` (`value:10` would mean that value must equal 10)
- `email` : input value must be a valid email address
- `password` : input value must match the following regex `/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/`
- `min:n` : input value's length must be minumum of `n` characters (`min:10` would mean that the value has to be at least 10 characters long)
- `max:n` : input value's length must be maximum of `n` characters (`max:10` would mean that the value has to be maximum 10 characters long)
- `confirmed` : input must have a matching input with the same name and `_confirmation` appended and both have to have the same value i.e `password`  and `password_confirmation`

## Form submission

Form will submit the input to the uri associated with its `action` attribute.
If response is to return any errors it should return them as json in the following format:

```
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