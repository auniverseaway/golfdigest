import { createTag } from "../../utils/utils.js";

const url = encodeURIComponent(window.location.href);
const socialLinks = {
    'facebook': { title: 'Facebook', href: `https://www.facebook.com/sharer.php?u=${url}`, id: 'facebook' },
    'twitter': { title: 'Twitter', href: `https://twitter.com/intent/tweet?url=${url}`, id: 'twitter' },
    'linkedin': { title: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, id: "linkedin" },
};

async function fetchSVGs() {
    const path = '/blocks/share/share.svg';
    const resp = await fetch(path);
    if (!resp.ok) return null;
    const text = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const svgs = doc.querySelector('svg');
    if (svgs) return svgs;
    return null;
}

async function getSVG(networkId, uuid) {
    const svgs = await fetchSVGs();
    if(!svgs) return null;
    const icon = svgs.getElementById(networkId);
    if (icon) {
        let id = 'icon-' + networkId + '-' + uuid;
        let el = createTag('svg', { 
            class: 'a-Icon o-SocialShare__a-Icon',
            version: '1.1', 
            xmlns: 'http://www.w3.org/2000/svg',
        });
        let useTag = createTag('use', { href: '#'+id});
        icon.id = id;
        el.appendChild(icon);
        el.appendChild(useTag);
        return el;
    }
    return null;
}

export default function decorate(block) {
    const container = block.children[0];
    container.children[0].classList.add('o-SocialShare');
    for (var icons of container.getElementsByTagName('ul')) icons.classList.add('m-SocialIcons'); 
    const list = container.getElementsByTagName('li');
    for (let el of list) {
        let title = el.innerHTML;
        let name = title.toLowerCase();
        let link = socialLinks[name];
        if (link) {
            getSVG(link.id, crypto.randomUUID()).then(svg => {
                if (svg) {
                    el.childNodes[0].remove();
                    decorateLinkItem(el, svg, link.href, title, link.id);
                }
            });
        } else {
            let lblSpan = createTag('span', {class:'o-SocialShare__a-ShareLabel'});
            let parent = el.parentElement;
            lblSpan.append(title);
            el.replaceChild(lblSpan, el.childNodes[0]);
        }
    }   
}

function decorateLinkItem(el, svg, url, title, networkId) {
    const iconSpan = createTag('span', { class: 'o-SocialShare__m-IconWrap' }, svg);
    const titleSpan = createTag('span', { class: 'o-SocialShare__a-Label' }, title);
    const linkTag = createTag('a', { 
        href: url,
        target: '_blank',
        title: 'Share on ' + title,
        class: 'o-SocialShare__m-ShareButton o-SocialShare__m-ShareButton--' + networkId,
    });
    linkTag.setAttribute('data-social-share-network', networkId);
    linkTag.append(iconSpan);
    linkTag.append(titleSpan);
    let tmpNode = document.createElement('div');
    tmpNode.append(linkTag);
    el.innerHTML = tmpNode.innerHTML;
}