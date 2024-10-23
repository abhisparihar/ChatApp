$(document).ready(() => {
    $("#editForm").validate({
        rules: {
            name: {
                required: true,
            },
            email: {
                required: true,
                email: true, // Adding email validation
            },
            phone: {
                required: true,
                rangelength: [10, 10], // Using rangelength for exact 10 digits
                digits: true, // Ensuring only digits are allowed
            }
        },
        messages: {
            name: {
                required: "Enter full name",
            },
            email: {
                required: "Email is required",
                email: "Please enter a valid email address"
            },
            phone: {
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

    $('.field-wrapper').on('change', '.profile', function () {
        var output = $(this).closest('.row').find('.propertyImage');
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(output).attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    $('.btnDeleteUser').off('click').on('click', async function () {
        const deleteProgramConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete a program!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        alert(1)
        console.log("🚀 ~ deleteProgramConfirm:", deleteProgramConfirm)

        if (deleteProgramConfirm.isConfirmed) {
            const id = $(this).data('id');
            $.ajax({
                url: `/users/delete/${id}`,
                type: 'delete',
                success: function (response) {
                    notify(response.type, response.message);
                    _this.loadTab('program');
                },
                error: (response) => {
                    if (response.type == 'error') {
                        notify('error', response?.message);
                    }
                    if (response?.responseJSON?.message) {
                        notify('error', response?.responseJSON?.message);
                    }
                }
            });
        }
    })
})