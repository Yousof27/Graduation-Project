import { useState } from "react";
import styles from "./marketManage.module.css";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAddProduct, useDeleteProduct, useProducts, useUpdateProduct } from "../../redux/products/productsApis";
import ProductCard from "../../components/products/product card/ProductCard";
import { successMessage } from "../../redux/toasts";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  desc: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  type: Yup.string().required("Type is required"),
  price: Yup.number().required("Price is required").positive("Price must be positive"),
  url: Yup.string().required("Image is required"),
  brand: Yup.string().required("Brand is required"),
  sideEffect: Yup.string().required("Side Effect is required"),
  disease: Yup.string().required("Disease is required"),
  maxQuantity: Yup.number().required("Max Quantity is required").positive("Max Quantity must be positive"),
  sales: Yup.number().required("Sales is required").min(0, "Sales cannot be negative"),
});

const MarketManage = () => {
  const { data: products = [], isLoading, error, refetch } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("url", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (selectedProduct) {
        await updateProductMutation.mutateAsync({ id: selectedProduct.id, ...values });
        successMessage("Product updated successfully");
      } else {
        await addProductMutation.mutateAsync(values);
        successMessage("Product added successfully");
      }
      resetForm();
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error("Error submitting product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      refetch();
      successMessage("Product Deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products.filter(
    (product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Market Management</h3>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search products..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.addButton} onClick={() => handleOpenModal()}>
              Add Product
            </button>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCardWrapper}>
                <ProductCard data={product}>
                  <div className={styles.actionButtons}>
                    <button className={styles.editButton} onClick={() => handleOpenModal(product)}>
                      Edit
                    </button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </div>
                </ProductCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedProduct ? "Edit Product" : "Add Product"}</h2>
            <Formik
              initialValues={{
                name: selectedProduct?.name || "",
                desc: selectedProduct?.desc || "",
                category: selectedProduct?.category || "",
                type: selectedProduct?.type || "",
                price: selectedProduct?.price || "",
                url: selectedProduct?.url || "",
                brand: selectedProduct?.brand || "",
                sideEffect: selectedProduct?.sideEffect || "",
                disease: selectedProduct?.disease || "",
                maxQuantity: selectedProduct?.maxQuantity || "",
                sales: selectedProduct?.sales || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Name</label>
                    <Field name="name" type="text" className={styles.input} />
                    <ErrorMessage name="name" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <Field name="desc" as="textarea" className={styles.input} />
                    <ErrorMessage name="desc" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <Field name="category" as="select" className={styles.input}>
                      <option value="">Select Category</option>
                      <option value="Accessories">Accessories</option>
                      <option value="medicine">Medicine</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Type</label>
                    <Field name="type" as="select" className={styles.input}>
                      <option value="">Select Type</option>
                      <option value="Glasses">Glasses</option>
                      <option value="Drops">Drops</option>
                      <option value="Pill">Pill</option>
                      <option value="Injection">Injection</option>
                      <option value="Implant">Implant</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Price</label>
                    <Field name="price" type="number" className={styles.input} />
                    <ErrorMessage name="price" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Image</label>
                    <input type="file" accept="image/*" className={styles.input} onChange={(event) => handleImageChange(event, setFieldValue)} />
                    <ErrorMessage name="url" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Brand</label>
                    <Field name="brand" type="text" className={styles.input} />
                    <ErrorMessage name="brand" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Side Effect</label>
                    <Field name="sideEffect" type="text" className={styles.input} />
                    <ErrorMessage name="sideEffect" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Disease</label>
                    <Field name="disease" type="text" className={styles.input} />
                    <ErrorMessage name="disease" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Max Quantity</label>
                    <Field name="maxQuantity" type="number" className={styles.input} />
                    <ErrorMessage name="maxQuantity" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Sales</label>
                    <Field name="sales" type="number" className={styles.input} />
                    <ErrorMessage name="sales" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formButtons}>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                      {selectedProduct ? "Update" : "Add"} Product
                    </button>
                    <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketManage;
