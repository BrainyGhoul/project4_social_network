class CreatePost extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            post_text: "",
        };
    }

    render () {
        return (
            <div>
                <div class="post-inner-container">
                    <div id="post-tweet">
                        <textarea onInput={this.expand} onChange={this.changetext} maxlength="500" id="new-post-content" class="spacing-line-container" placeholder="what's happening?"  rows="1" value={this.state.post_text}></textarea>
                        <div class="spacing-line-container"><div class="spacing-line"></div></div>
                        <span class="text-length">{this.state.post_text.length}/500</span>
                        <button class="btn btn-primary button" onClick={this.post}>Tweet</button>
                    </div>
                </div>
                <div>
                    <div id="timeline-spacing"></div>
                    <div class="spacing-line"></div>
                </div>
            </div>
        );
    }
                            
    post = () => {
        const post_content =  document.querySelector("#new-post-content")
        if (post_content != "") {
            fetch("/post", {
                method: "POST",
                body: JSON.stringify({
                    task: "create_post",
                    post_text: post_content.innerHTML
                })
            }).then(response =>  {
                post_content.style.animationPlayState = "running";
                if (response.status == 201) {
                    setTimeout(() => {
                        this.setState({
                            post_text: ""
                        });
                        if (post_content.innerHTML == "") {
                            
                            animationFillMode = "backward";
                            animationPlayState = "running";
                        }
                    }, 1000);
                } else {
                    console.log(response.error);
                }
                
            });
        }

        
        return false;
    }
    
    changetext = (event) => {
        this.setState({
            post_text: event.target.value
        });
    };

    expand = (event) => {
        event.target.style.height = "5px";
        event.target.style.height = (event.target.scrollHeight)+"px";
    }
}



class PostOrProfile extends React.Component {
    // this components is same for both profile and posts
    constructor (props) {
        super(props);
        // this.props = this.props.json();
        this.state = {
            // is_liked_or_is_followed is used becuase the posts is liked or liked without getting data from the server.
            is_liked_or_is_followed: this.props.is_liked_or_is_followed,
            // this helps us differenciate between the likes when the user communicates with like button
            current_likes_or_followers: this.props.likes_or_followers,
            button_color: this.toggle_color(this.props.is_liked_or_is_followed),
            text: this.props.text
        }
    }
    render () {
        if (this.props.is_post === true){
            document.querySelector("#container").style.height = "auto";
            if (this.props.same_author) {
                var edit = <div class="edit-container"><button class="btn btn-link edit-button" onClick={this.edit_post} >Edit</button></div>;
            }
            return (
                <div class="post-inner-container">
                    <a href={"/profile/" + this.props.author} class="posts-authors">{this.props.author}</a>
                    {edit}
                    <div class="post-text-container">
                        <textarea class="posts-text" onChange={this.display} disabled value={this.state.text}></textarea>
                        <input type="submit" value="submit" class="btn btn-primary button edit-post-submit" onClick={this.edit_submit} ></input>
                    </div>
                    <span class="posted-date">{this.props.posted}</span>
                    <div>
                        <svg onClick={this.like_or_follow} style={{fill: this.state.button_color}} id={`like-symbol${this.props.id}`} class="like-symbol" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/></svg>
                        <span class="posts-likes">{this.state.current_likes_or_followers}</span>
                    </div>
                </div>
            );
        } else {
            return (
                <div class="post-inner-container">
                    <h4>{ this.props.username }</h4>
                    <svg onClick={this.like_or_follow} style={{fill: this.state.button_color}} class="svg-icon" height="25px" width="25px" viewBox="0 0 20 20">
                        <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
                    </svg>
                    <table>
                        <tbody>
                            <tr>
                                <th>Following:</th>
                                <td>{ this.props.following }</td>
                            </tr>
                            <tr>
                                <th>Followers:</th>
                                <td>{ this.state.current_likes_or_followers }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }
    display = (event) => {
        this.setState({
            text: event.target.value
        });
        console.log(this.state.text);
    }
    edit_submit = (event) => {
        var button = event.target;
        var post = event.target.parentElement.querySelector("textarea.posts-text");
        fetch(`/edit_post/${this.props.id}`, {
            method: "POST",
            body: JSON.stringify({
                text: this.state.text
            })
        }).then(response => response.json())
        .then(message => {
            this.setState({
                text: message.text
            });
            button.style.display = "none";
            post.disabled = true;
        });
    }

    edit_post = (event) => {
        var container = event.target.parentElement.parentElement;
        container.querySelector(".posts-text").disabled = false;
        container.querySelector(".edit-post-submit").style.display = "block";
    }
                
    like_or_follow = () => {
        var task = "";
        if (this.props.is_post === true) {
            task = "like_post";
        } else {
            if (this.props.same_user) {
                return false;
            }
            task = "follow";
        }
        // if the like button is clicked
        fetch("/post", {
            method: 'POST',
            body: JSON.stringify({
                task: task,
                id: this.props.id
            })
        }).then(response => response.json())
        .then(message => {
            
            if (message.message === "request successful") {
                
                // temp variables
                var liked_or_followed = !(this.state.is_liked_or_is_followed)
                var likes_or_followers = "";
                
                // changing the number of likes or followers after following or unfollowing or liking or unliking
                if ((this.props.is_liked_or_is_followed) && !(liked_or_followed)) {
                    likes_or_followers = this.props.likes_or_followers - 1;
                } else if (!(this.props.is_liked_or_is_followed) && liked_or_followed) {
                    likes_or_followers = this.props.likes_or_followers + 1;
                } else {
                    likes_or_followers = this.props.likes_or_followers;
                }
                
                // setting the values of everything
                this.setState({
                    current_likes_or_followers: likes_or_followers,
                    is_liked_or_is_followed: liked_or_followed,
                    button_color: this.toggle_color(liked_or_followed)
                });
                
            }
        });
    }
    
    toggle_color = (is_liked_or_is_followed) => {
        // determinig the color of the buttons
        var color = "black";
        if (is_liked_or_is_followed === true) {
            if (this.props.is_post === true){
                color =  "red";
            } else {
                color = "blue";
            }
        }

        return color;
    }
}

class DisplayPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            posts: []
        };
    }

    render () {
        return (
            <div>
                <div id="post-heading">
                    <h4>Posts:</h4>
                </div>
                <div id="posts">
                    {
                        this.state.posts.map(( post => {
                            return (
                                <PostOrProfile same_author={post.same_author} is_post={true} key={post.pk} id={post.pk} author={post.fields.author} text={post.fields.text} likes_or_followers={post.fields.likes.length} is_liked_or_is_followed={post.fields.is_liked} posted={post.fields.date_and_time} />
                            )
                        }))
                    }
                </div>
                <div id="load-posts-conatainer">
                    <button class="btn btn-primary button" id="load-posts" onClick={this.load_posts}>Load Posts</button>
                    <span class="alert alert-primary" id="read-all-posts" >No more posts!</span>
                </div>
            </div>
        );
    }


    load_posts = () => {
        // changing routes based on the filtering of posts of the page being viewed
        var link = this.props.page;
        if (this.props.page === "profile") {
            link = this.props.profile;
        }
        console.log(this.props.page)

        fetch(`/posts/${link}/${this.state.page}`)
        .then(posts => posts.json())
        .then(post_list => {
            if (post_list.error === "no more posts") {
                // if there are no more posts, the button for more posts will disappear
                document.querySelector("button#load-posts").style.display = "none";
                document.querySelector("#read-all-posts").style.display = "block";
            } else {
                post_list.posts.forEach(post => {
                    this.state.posts.push(post);
                });
                // but if there are, those posts will be added to the existing posts
                this.setState({
                    page: this.state.page + 1
                });
            }
        });
        return false;
    }
}
