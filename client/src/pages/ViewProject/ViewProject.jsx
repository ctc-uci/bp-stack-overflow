import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../Home/Home';

function ViewProject() {
  const { project } = useParams();
  const [validProject, setValidProject] = useState(false);
  const [projectPosts, setProjectPosts] = useState([]);

  async function getAllPosts() {
    const postsResponse = await fetch(`${BACKEND_URL}/api/searchPosts?page=0`);
    const posts = (await postsResponse.json()).result;
    setProjectPosts(
      posts.filter(p => {
        if (p.tags) {
          return p.tags.includes(project);
        }
        return false;
      }),
    );
  }

  useEffect(() => {
    const projectArr = ['fya', 'och', 'tlp', 'afc'];
    if (projectArr.includes(project)) {
      setValidProject(true);
      getAllPosts();
    }
  });

  if (validProject) {
    return (
      <div className="container" style={{ minHeight: '70vh' }}>
        <h1>{project.toUpperCase()} Posts</h1>
        {console.log(projectPosts)}
        {projectPosts.map((p, index) => {
          return (
            <div
              className="p-3"
              key={p.id}
              style={{ backgroundColor: index % 2 === 0 ? '#eee' : 'white' }}
            >
              <h2>
                <a href={`/posts/${p.id}`}>{p.title}</a>
              </h2>
              <p>{p.body}</p>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ minHeight: '70vh' }}>
      <p>Project not found!</p>
    </div>
  );
}

export default ViewProject;
