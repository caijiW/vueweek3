import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js';

let productModal = '';
let delProductModal = '';
const app = {
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2/',
            path: 'caiji_hexschool',
            products: [],
            productTemp: {
                category: '',
                imagesUrl: []
            },
            file: null,
            uploadImgName: null,
            categoryType: 'categoryOld',
            isNew: true
        }
    },
    methods: {
        checkLogin() {
            axios.post(`${this.url}api/user/check`)
                .then((res) => {
                    console.log(res);
                    this.getProductsList();
                })
                .catch((err) => {
                    console.log(err);
                    window.location = './login.html';
                })
        },
        getProductsList() {
            axios.get(`${this.url}api/${this.path}/admin/products`)
                .then((res) => {
                    console.log(res);
                    this.products = res.data.products;
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        openModal() {
            productModal.show();
        },
        closeModal() {
            productModal.hide();
        },
        delProductModal(){
            delProductModal.show();
        },
        addProductTemp(status, product) {
            if (status === 'create') {
                this.isNew = true;
                this.productTemp = {
                    category: '',
                    imagesUrl: []
                }
                this.openModal();
            } else if (status === 'edit') {
                this.isNew = false;
                //深層拷貝
                this.productTemp = JSON.parse(JSON.stringify(product));

                if (!this.productTemp.imagesUrl) {
                    this.productTemp.imagesUrl = [];
                }
                this.openModal();
            }else{
                this.productTemp = JSON.parse(JSON.stringify(product));
                this. delProductModal();
            }
        },
        updateItem() {
           
            let method = 'post';
            let site = `${this.url}api/${this.path}/admin/product`;
           if(!this.isNew){
                console.log('編輯');
                method = 'put';
                site = `${this.url}api/${this.path}/admin/product/${this.productTemp.id}`;
            }
            axios[method](site, { data: this.productTemp })
                    .then((res) => {
                        console.log(res);
                        this.closeModal();
                        this.productTemp = {};
                        this.uploadImgName = null;
                        this.file = null;
                        this.getProductsList();
                    })
                    .catch((err) => {
                        console.dir(err);
                    })
        },
        delItem(){
            console.log(this.productTemp);
            axios.delete(`${this.url}api/${this.path}/admin/product/${this.productTemp.id}`)
            .then((res) => {
                console.log(res);
                this.getProductsList();
                delProductModal.hide();
            })
            .catch((err) => {
                console.dir(err);
            })
        },
        uploadImage(e) {
            // const file = fileBtn.files[0];
            console.dir(e.target.files[0]);
            this.file = e.target.files[0];
            const formData = new FormData();
            formData.append('file-to-upload', this.file);
            axios.post(`${this.url}api/${this.path}/admin/upload`, formData)
                .then((res) => {
                    console.log(res);
                    console.log(res.data.imageUrl);
                    this.productTemp.imageUrl = res.data.imageUrl;
                })
                .catch((err) => {
                    console.dir(err.response);
                })
        }
    },
    watch: {
        categoryType() {
            this.productTemp.category = '';
        }
    },
    computed: {
        sortOldCategory() {
            const categoryArr = Object.values(this.products);
            let newCategoryArr = {};
            newCategoryArr = new Set(categoryArr.map(item => item.category));
            return newCategoryArr;
        }
    },
    mounted() {
        //取出cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)caijiToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        //放入axios headers裡 每次發請求都夾帶cookie一起送出
        axios.defaults.headers.common['Authorization'] = token;

        this.checkLogin();
        const modal = document.querySelector('#productModal');
        productModal = new bootstrap.Modal(modal);
        const delModal = document.querySelector('#delProductModal');
        delProductModal = new bootstrap.Modal(delModal);
    }
}

createApp(app).mount('#app');