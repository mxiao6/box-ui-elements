// @flow
import React from 'react';
import Media from '../../../../../components/media/Media';

import './LinkPreview.scss';

type LinkPreviewProps = {
    description: string,
    domain: string,
    img: string,
    link: string,
    title: string,
};
const LinkPreview = (props: LinkPreviewProps) => (
    <Media className="LinkPreview">
        <Media.Body>
            <span className="LinkPreview-title">
                <a href={props.link} rel="noopener noreferrer" target="_blank">
                    {props.title}
                </a>
            </span>
            <p>{props.description}</p>
        </Media.Body>
        <Media.Figure className="LinkPreview-image">
            <img src={props.img} alt={props.title} width={48} />
        </Media.Figure>
    </Media>
);

export default LinkPreview;
