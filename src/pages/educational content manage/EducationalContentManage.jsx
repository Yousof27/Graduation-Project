import { useState } from "react";
import styles from "./educationalContentManage.module.css";
import { useAllPosts, useAddPost, useUpdatePost, useDeletePost } from "../../redux/posts/postsApis.js";
import EducationalCard from "../../components/educationalCard/EducationalCard";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { successMessage } from "../../redux/toasts";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  type: Yup.string().oneOf(["article", "video", "image-article"], "Invalid type").required("Type is required"),
  category: Yup.string().required("Category is required"),
  readTime: Yup.string().required("Read Time is required"),
  author: Yup.string().required("Author is required"),
  description: Yup.string().required("Description is required"),
  content: Yup.string().required("Content is required"),
  icon: Yup.string().required("Icon is required"),
});

const EducationalContentManage = () => {
  const { data: posts = [], isLoading, error, refetch } = useAllPosts();
  const addPostMutation = useAddPost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = (post = null) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const postData = {
        ...values,
        statues: selectedPost?.statues || "not saved",
        color: selectedPost?.color || "",
      };
      if (selectedPost) {
        await updatePostMutation.mutateAsync({ id: selectedPost.id, postData });
        successMessage("Post updated successfully");
      } else {
        await addPostMutation.mutateAsync(postData);
        successMessage("Post added successfully");
      }
      resetForm();
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error("Error submitting post:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePostMutation.mutateAsync(id);
      successMessage("Post deleted successfully");
      refetch();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const filteredPosts = posts.filter(
    (post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.mainSection}>
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Educational Content Management</h3>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search posts..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.addButton} onClick={() => handleOpenModal()}>
              Add Post
            </button>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <div className={styles.postGrid}>
            {filteredPosts.map((post) => (
              <div key={post.id} className={styles.postCardWrapper}>
                <EducationalCard card={post} role="admin" userPosts={[]} successMessage={successMessage}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(post);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </EducationalCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedPost ? "Edit Post" : "Add Post"}</h2>
            <Formik
              initialValues={{
                title: selectedPost?.title || "",
                type: selectedPost?.type || "",
                category: selectedPost?.category || "",
                readTime: selectedPost?.readTime || "",
                author: selectedPost?.author || "",
                description: selectedPost?.description || "",
                content: selectedPost?.content || "",
                icon: selectedPost?.icon || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <Field name="title" type="text" className={styles.input} />
                    <ErrorMessage name="title" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Type</label>
                    <Field name="type" as="select" className={styles.input}>
                      <option value="">Select Type</option>
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                      <option value="image-article">Image Article</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <Field name="category" as="select" className={styles.input}>
                      <option value="">Select Category</option>
                      <option value="General Care">General Care</option>
                      <option value="Disease Prevention">Disease Prevention</option>
                      <option value="Diabetes & Eyes">Diabetes & Eyes</option>
                      <option value="Age-Related Conditions">Age-Related Conditions</option>
                      <option value="Modern Eye Care">Modern Eye Care</option>
                      <option value="Lifestyle & Nutrition">Lifestyle & Nutrition</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Read Time</label>
                    <Field name="readTime" type="text" className={styles.input} />
                    <ErrorMessage name="readTime" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Author</label>
                    <Field name="author" type="text" className={styles.input} />
                    <ErrorMessage name="author" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <Field name="description" as="textarea" className={styles.input} />
                    <ErrorMessage name="description" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Content</label>
                    <Field name="content" as="textarea" className={styles.input} />
                    <ErrorMessage name="content" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Icon</label>
                    <Field name="icon" as="select" className={styles.input}>
                      <option value="">Select Icon</option>
                      <option value="FaBook">Book</option>
                      <option value="FaPlay">Play</option>
                      <option value="FaExclamationTriangle">Exclamation Triangle</option>
                      <option value="FaImage">Image</option>
                      <option value="FaHeart">Heart</option>
                      <option value="FaEye">Eye</option>
                    </Field>
                    <ErrorMessage name="icon" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formButtons}>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                      {selectedPost ? "Update" : "Add"} Post
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

export default EducationalContentManage;
