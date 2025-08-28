$(document).ready(() => {
    // Custom method for password validation
    $.validator.addMethod("passwordCheck", function (value, element) {
        return this.optional(element) ||
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
    }, "Password must be at least 8 characters long, and include one uppercase letter, one lowercase letter, one number, and one special character.");

    $("#loginForm").validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 8,
                passwordCheck: true
            },
        },
        messages: {
            email: {
                required: "Email is required",
                email: "Please enter a valid email address",
            },
            password: {
                required: "Password is required",
                minlength: "Password must be at least 8 characters long",
                passwordCheck: "Include one uppercase letter, one lowercase letter, one number, and one special character."
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element)
        },
        errorClass: "text-danger",
        highlight: function (element, errorClass, validClass) {
            $(element).closest('.field').addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.field').removeClass(errorClass).addClass(validClass);
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        },
        submitHandler: function (form) {
            $.ajax({
                url: form.action,
                type: form.method,
                data: $(form).serialize(),
                success: function (response) {
                    toastr.success(response.success);
                    if (response.role === 'superAdmin') {
                        return setTimeout(() => {
                            window.location.href = '/dashboard'
                        }, 1000)
                    }
                    return setTimeout(() => {
                        window.location.href = '/user-chat'
                    }, 1000)
                },
                error: function (error) {
                    if (error?.responseJSON?.error) {
                        toastr.error(error.responseJSON.error);
                    }
                }
            });
        },
    });

    $("#registrationForm").validate({
        rules: {
            email: {
                required: true,
                email: true, // Adding email validation
                remote: {
                    url: "/check-email", // Adjust URL to your endpoint
                    type: "post",
                    data: {
                        email: function () {
                            return $("#email").val();
                        }
                    },
                    dataType: "json"
                }
            },
            password: {
                required: true,
                minlength: 8,
                passwordCheck: true
            },
            mobile: {
                required: true,
                rangelength: [10, 10], // Using rangelength for exact 10 digits
                digits: true // Ensuring only digits are allowed
            }
        },
        messages: {
            email: {
                required: "Email is required",
                email: "Please enter a valid email address",
                remote: "This email is already registered."
            },
            password: {
                required: "Password is required",
                minlength: "Password must be at least 8 characters long",
                passwordCheck: "Include one uppercase letter, one lowercase letter, one number, and one special character."
            },
            mobile: {
                required: "Enter mobile number",
                rangelength: "Mobile number must be exactly 10 digits",
                digits: "Please enter a valid mobile number with digits only"
            }
        },
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent()); // For input group, insert error after the parent div
            } else {
                error.insertAfter(element); // Default
            }
        },
        errorClass: "text-danger",
        highlight: function (element, errorClass, validClass) {
            $(element).closest('.field').addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.field').removeClass(errorClass).addClass(validClass);
        },
    });
})