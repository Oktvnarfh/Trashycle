(function ($) {
    $(document).ready(function () {
        const form = $("#signup-form");

        // Inisialisasi jQuery Steps
        form.children("div").steps({
            headerTag: "h3",
            bodyTag: "fieldset",
            transitionEffect: "fade",
            stepsOrientation: "vertical",
            titleTemplate:
                '<div class="title-form"><span class="step-number">#index#</span><span class="step-text">#title#</span></div>',
            labels: {
                previous: "Previous",
                next: "Next",
                finish: "Finish",
                current: "",
            },
            onStepChanging: function (event, currentIndex, newIndex) {
                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            },
            onFinishing: function (event, currentIndex) {
                form.validate().settings.ignore = ":disabled";
                return form.valid();
            },
            onFinished: function (event, currentIndex) {
                updateSelectedCategories();

                const formData = new FormData(form[0]);

                // Debugging: cek isi FormData sebelum dikirim
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }

                // Kirim data form ke server melalui AJAX
                $.ajax({
                    url: "/home/submit-form",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        console.log("Form submission success:", response);
                        alert("Form berhasil dikirim!");
                        window.location.href = "/home/dashboard";
                    },
                    error: function (xhr, status, error) {
                        console.error("Form submission error:", xhr.responseText);
                        alert("Gagal mengirim form: " + xhr.responseText);
                    },
                });
            },
        });

        // Menambahkan kategori dan menyimpannya
        $("#add-category-btn").on("click", function () {
            const kategoriId = $("#kategori_id").val();
            const jumlah = parseFloat($("#jumlah").val());
            const harga = parseFloat($("#kategori_id option:selected").data("harga"));
            const kategoriNama = $("#kategori_id option:selected").text();

            if (!kategoriId || isNaN(jumlah) || isNaN(harga)) {
                alert("Harap pilih kategori sampah dan masukkan berat yang valid.");
                return;
            }

            // Tambahkan kategori ke daftar
            const total = jumlah * harga;
            $("#categories-list").append(`
                <li class="list-group-item d-flex justify-content-between align-items-center" data-category-id="${kategoriId}" data-weight="${jumlah}" data-price-per-kg="${harga}">
                    ${kategoriNama} - ${jumlah.toFixed(2)} kg @ Rp ${harga.toLocaleString("id-ID")} /kg
                    <button type="button" class="btn btn-danger btn-sm remove-category">Hapus</button>
                </li>
            `);

            // Menambahkan event listener untuk tombol hapus
            $(".remove-category").off("click").on("click", function () {
                $(this).closest("li").remove();
                updateSelectedCategories();
            });

            updateSelectedCategories(); // Update kategori yang dipilih
        });

        // Fungsi untuk memperbarui kategori yang dipilih
        function updateSelectedCategories() {
            const selectedCategories = [];
            $("#categories-list li").each(function () {
                const categoryId = $(this).data("category-id");
                const weight = $(this).data("weight");
                const pricePerKg = $(this).data("price-per-kg");
                const total = weight * pricePerKg;

                selectedCategories.push({
                    kategori_id: categoryId,
                    weight: weight,
                    pricePerKg: pricePerKg,
                    total: total
                });
            });

            // Simpan kategori yang dipilih ke dalam input hidden
            $("#selectedCategories").val(JSON.stringify(selectedCategories));
        }

        // Inisialisasi ulang tombol hapus saat halaman dimuat
        $(".remove-category").on("click", function () {
            $(this).closest("li").remove();
            updateSelectedCategories();
        });
    });
})(jQuery);


        // Event handler for adding categories
        // $(document).on('click', '#add-category-btn', function() {
        //     const categoryId = $('#kategori_id').val();
        //     const categoryText = $('#kategori_id option:selected').text(); // Nama kategori
        //     const weight = $('#jumlah').val();
        //     const pricePerKg = $('#kategori_id option:selected').data('harga'); // Ambil harga per kilo

        //     // Validasi jika kategori dan berat sudah diisi
        //     if (!categoryId || !weight) {
        //         alert('Jenis sampah dan berat harus diisi!');
        //         return;
        //     }

        //     // Buat item list
        //     const listItem = $(`
        //         <li class="list-group-item d-flex justify-content-between align-items-center" data-category-id="${categoryId}" data-price-per-kg="${pricePerKg}">
        //             ${categoryText} - ${weight} kg
        //             <button type="button" class="btn btn-danger btn-sm remove-category">Hapus</button>
        //         </li>
        //     `);

        //     // Tambahkan item ke dalam list
        //     $('#categories-list').append(listItem);

        //     // Tambahkan event listener untuk tombol "Hapus" pada item
        //     listItem.find('.remove-category').on('click', function() {
        //         listItem.remove();
        //         // Setelah menghapus item, pastikan data 'selectedCategories' diupdate
        //         updateSelectedCategories();
        //     });

        //     // Reset dropdown dan input berat setelah menambahkan item
        //     $('#kategori_id').val('');
        //     $('#jumlah').val('');
        // });
